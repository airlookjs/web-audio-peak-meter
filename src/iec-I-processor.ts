import { iecIvalues, type IecIChannelState } from './iec-I';

class IecIProcessor extends AudioWorkletProcessor {

  sampleRate: number;

  attackFilterCoefficient1: number;   //_w1
  attackFilterCoefficient2: number;   //_w2
  releaseFilterCoefficient: number;   //_w3
  gainFactor: number;                 // _g

  channelStates: IecIChannelState[];

  constructor() {
    super();
    //@ts-ignore
    this.sampleRate = sampleRate;
    this.attackFilterCoefficient1 = 450.0 / this.sampleRate;
    this.attackFilterCoefficient2 = 1300.0 / this.sampleRate;
    this.releaseFilterCoefficient = 1.0 - 5.4 / this.sampleRate;
    this.gainFactor = 0.5108;
    this.channelStates = [];
    this.port.postMessage({type: 'message', message: `iec I inited? ${this.sampleRate}`});
  }

  process(inputs:Float32Array[][]) {
    const input = inputs[0];
    if (input.length > this.channelStates.length) {
      for (let i = 1; i <= input.length; i += 1) {
        if (i > this.channelStates.length) {
          this.channelStates.push({
            z1: 0,
            z2: 0,
            m: 0,
          });
        }
      }
    }
    const maxes = iecIvalues(input, this.channelStates, this.attackFilterCoefficient1, this.attackFilterCoefficient2, this.releaseFilterCoefficient);
    this.port.postMessage({type: 'peaks', peaks: maxes});
    return true;
  }
}

try {
  registerProcessor('iec-I-processor', IecIProcessor);
} catch (err) {
  console.info('Failed to register iec-I-processor. This probably means it was already registered.');
}
