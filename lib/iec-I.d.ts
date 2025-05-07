export type IecIChannelState = {
    z1: number;
    z2: number;
    m: number;
};
export declare function iecIvalues(input: Float32Array[], channelStates: IecIChannelState[], attackFilterCoefficient1: number, attackFilterCoefficient2: number, releaseFilterCoefficient: number): number[];
