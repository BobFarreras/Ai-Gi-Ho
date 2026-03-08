// src/services/game/match/LocalMatchController.ts - Implementación base de controller para matches locales con estado inmutable y resolver inyectado.
import { ValidationError } from "@/core/errors/ValidationError";
import { GameState } from "@/core/use-cases/game-engine/state/types";
import { IMatchActionRequest, IMatchConfig, IMatchController } from "@/core/entities/match";

export class LocalMatchController implements IMatchController {
  public readonly mode;
  public readonly seed;
  private readonly createState: IMatchConfig["initialStateFactory"];
  private readonly actionResolver: IMatchConfig["actionResolver"];
  private state: GameState;

  constructor(config: IMatchConfig) {
    this.mode = config.mode;
    this.seed = config.seed;
    this.createState = config.initialStateFactory;
    this.actionResolver = config.actionResolver;
    this.state = this.createState();
  }

  public async initialize(): Promise<GameState> {
    this.state = this.createState();
    return this.state;
  }

  public getSnapshot(): GameState {
    return this.state;
  }

  public async dispatch(action: IMatchActionRequest): Promise<GameState> {
    if (!this.actionResolver) {
      throw new ValidationError("El modo actual no define un resolvedor de acciones para el match.");
    }
    const nextState = await this.actionResolver(this.state, action);
    this.state = nextState;
    return this.state;
  }

  public async reset(): Promise<GameState> {
    this.state = this.createState();
    return this.state;
  }
}
