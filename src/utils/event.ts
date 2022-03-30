import EventEmitter from "events";
import { Service } from "typedi";

@Service()
export class Emitter {
  emitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  getInstance() {
    return this.emitter;
  }
}
