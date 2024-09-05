// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

'use client'

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import {
  AzureCommunicationCallAdapterOptions,
  CallAdapter,
  CallAdapterLocator,
  CallAdapterState,
  CommonCallAdapter,
  useAzureCommunicationCallAdapter,
} from '@azure/communication-react';

import type { StartCallIdentifier } from '@azure/communication-react';
import { onResolveVideoEffectDependencyLazy } from '@azure/communication-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { CallCompositeContainer } from './CallCompositeContainer';

export interface CallProps {
  azureToken: string;
  azureIdentity: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
  callLocator?: CallAdapterLocator;
  targetCallees?: StartCallIdentifier[];
  displayName: string;
}

export const Call = (props: CallProps): JSX.Element => {
  const { azureToken: token, azureIdentity: userId } = props;
  const callIdRef = useRef<string>();

  const subscribeAdapterEvents = useCallback((adapter: CommonCallAdapter) => {
    adapter.on('error', (e) => {
      // Error is already acted upon by the Call composite, but the surrounding application could
      // add top-level error handling logic here (e.g. reporting telemetry).
      console.log('Adapter error event:', e);
    });
    adapter.onStateChange(async (state: CallAdapterState) => {
      const pageTitle = convertPageStateToString(state);
      console.log("pageTitle");
      console.log(pageTitle);

      if (state?.call?.id && callIdRef.current !== state?.call?.id) {
        callIdRef.current = state?.call?.id;
        console.log(`Call Id: ${callIdRef.current}`);
      }
    });
    adapter.on('transferAccepted', (e) => {
      console.log('Call being transferred to: ' + e);
    });
  }, []);

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  //the below code is used to refresh the tokens for a azureIdentity User
  const credential = useMemo(() => {
    return new AzureCommunicationTokenCredential(token);
  }, [token, userId]);

  return <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />;
};

type AzureCommunicationCallScreenProps = CallProps & {
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, azureIdentity: userId, ...adapterArgs } = props;

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        onResolveDependency: onResolveVideoEffectDependencyLazy
      },
      callingSounds: {
        callEnded: { url: '/sounds/callEnded.mp3' },
        callRinging: { url: '/sounds/callRinging.mp3' },
        callBusy: { url: '/sounds/callBusy.mp3' }
      },
      reactionResources: {
        likeReaction: { url: '/images/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: '/images/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: '/images/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: '/images/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: '/images/reactions/surprisedEmoji.png', frameCount: 102 }
      }
    };
  }, []);

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      options: callAdapterOptions
    },
    afterCreate
  );
  return <CallCompositeContainer {...props} adapter={adapter} />;
};

const convertPageStateToString = (state: CallAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'badRequest':
      return 'error';
    case 'leftCall':
      return 'end call';
    case 'removedFromCall':
      return 'end call';
    default:
      return `${state.page}`;
  }
};

const videoBackgroundImages = [
  {
    key: 'batman',
    url: './images/background/batman.jpeg',
    tooltipText: 'I am Batman'
  },
  {
    key: 'joker',
    url: './images/background/joker.jpeg',
    tooltipText: 'I am Joker'
  }
];