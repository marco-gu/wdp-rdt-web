import { ScreenState } from "./modules/screenModule";
import { WorkflowState } from "./modules/workflowModule";

export default interface RootState {
  // root state
}

export interface State extends RootState {
  workflowModule: WorkflowState;
  screenModule: ScreenState;
}
