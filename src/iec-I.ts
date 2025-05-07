
export type IecIChannelState = {
  z1: number;
  z2: number;
  m: number;
};

export function iecIvalues(input:Float32Array[], channelStates:IecIChannelState[], attackFilterCoefficient1: number, attackFilterCoefficient2: number, releaseFilterCoefficient: number): number[] {
  return input.map((channel, i) => {
    const channelState = channelStates[i];
    let max = 0;
    let z1 = Math.min(Math.max(channelState.z1, 0), 20);
    let z2 = Math.min(Math.max(channelState.z2, 0), 20);

    const _w1 = attackFilterCoefficient1;
    const _w2 = attackFilterCoefficient2;

    for (let j = channel.length; j >= 0; j -= 4) {
      z1 *= releaseFilterCoefficient;
      z2 *= releaseFilterCoefficient;

      for (let k = 0; k < 4; k++) {
        const t = Math.abs(channel[j + k]);
        if (t > z1) z1 += _w1 * (t - z1);
        if (t > z2) z2 += _w2 * (t - z2);
      }

      const tSum = z1 + z2;
      if (tSum > max) max = tSum;
    }

    channelState.z1 = z1;
    channelState.z2 = z2;
    channelState.m = max;

    return max;
  });
}
