// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

'use client'

import { CallComposite, CallCompositeOptions, CommonCallAdapter } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import { useEffect, useMemo, useState } from 'react';
import { CallProps } from './Call';
import MobileDetect from 'mobile-detect';

export type CallCompositeContainerProps = CallProps & { adapter?: CommonCallAdapter };

export const CallCompositeContainer = (props: CallCompositeContainerProps): JSX.Element => {
    const { adapter } = props;
    // const { serverCallId } = props;
    const isMobileSession = useIsMobile();
    // const [recordingId, setRecordingId] = useState('');
    const shouldHideScreenShare = isMobileSession || isIOS();

    useEffect(() => {
        /**
         * We want to make sure that the page is up to date. If for example a browser is dismissed
         * on mobile, the page will be stale when opened again. This event listener will reload the page
         */
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        });
        return () => {
            window.removeEventListener('pageshow', () => {
                window.location.reload();
            });
        };
    }, []);

    const options: CallCompositeOptions = useMemo(
        () => ({
            surveyOptions: {
                disableSurvey: true,
            },
            callControls: {
                // onFetchCustomButtonProps: [
                //   recordingButtonPropsCallback(serverCallId, recordingId, setRecordingId)
                // ],
                screenShareButton: shouldHideScreenShare ? false : undefined,
                endCallButton: {
                    hangUpForEveryone: false
                }
            },
        }),
        [shouldHideScreenShare]
        // [shouldHideScreenShare, serverCallId, recordingId]
    );

    // Dispose of the adapter in the window's before unload event.
    // This ensures the service knows the user intentionally left the call if the user
    // closed the browser tab during an active call.
    useEffect(() => {
        const disposeAdapter = (): void => adapter?.dispose();
        window.addEventListener('beforeunload', disposeAdapter);
        return () => window.removeEventListener('beforeunload', disposeAdapter);
    }, [adapter]);

    if (!adapter) {
        return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
    }

    let callInvitationUrl: string | undefined = window.location.href;

    return (
        <CallComposite
            adapter={adapter}
            // fluentTheme={currentTheme.theme}
            // rtl={currentRtl}
            callInvitationUrl={callInvitationUrl}
            formFactor={isMobileSession ? 'mobile' : 'desktop'}
            options={options}
        />
    );
};


const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

/**
 * Detect if the app is running in a mobile browser and updated if that changes (e.g. when switching to a mobile browser in a browser emulator)
 * @returns true if this detects the app is running in a mobile browser
 */
const useIsMobile = (): boolean => {
    // Whenever the sample is changed from desktop -> mobile using the emulator, make sure we update the formFactor.
    const [isMobileSession, setIsMobileSession] = useState<boolean>(detectMobileSession());
    useEffect(() => {
        const updateIsMobile = (): void => {
            // The userAgent string is sometimes not updated synchronously when the `resize` event fires.
            setTimeout(() => {
                setIsMobileSession(detectMobileSession());
            });
        };
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    return isMobileSession;
};


const isIOS = (): boolean =>
    /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);