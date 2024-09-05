'use client'

import { PrimaryButton, Stack, Text, TextField, Image, StackItem } from "@fluentui/react";
import { useState } from "react";
import _ from "lodash";

interface IAzureMeetingConfigProps {
    setDisplayName: (val: string) => void
}

export function AzureMeetingConfig(props: IAzureMeetingConfigProps) {
    const [displayName, setDisplayName] = useState('');
    return (
        <Stack
            className="mx-auto mt-8"
            verticalAlign="center"
            horizontalAlign="center"
            styles={{ root: { height: '100%', width: "40%", minWidth: '10rem' } }}
            tokens={{ childrenGap: 16 }}
        >
            <StackItem>
                <Image src="/images/logos/doctor-svgrepo-com.svg" width={80} height={80} />
            </StackItem>

            <StackItem>
                <Text variant="medium">Enter your display name</Text>
            </StackItem>

            <StackItem>
                <TextField
                    placeholder="eg. John Doe"
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    styles={{ root: { textAlign: 'center' } }}
                />
            </StackItem>

            <StackItem>
                <PrimaryButton
                    text="Join Meeting"
                    onClick={() => props.setDisplayName(displayName)}
                    disabled={!displayName}
                    styles={{ root: { width: '100%' } }}
                />
            </StackItem>
        </Stack>

    );
}