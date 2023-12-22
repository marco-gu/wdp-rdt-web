import { Module } from "vuex";
import RootState from "../state";
import { post } from "@/service/http";
import {
  CapturedValue,
  EngineRequset,
  UserSettingDto,
} from "@/entity/request.entity";
import {
  ScreenModel,
  ScreenLineEntity,
  ActionKeyEnum,
} from "@/entity/screen.entity";
import { composeScreenData } from "@/utils/type3.parse";
import _ from "lodash";

export interface WorkflowState {
  screenModel: ScreenModel;
  subFormModel: ScreenModel;
  rowsEntity: Map<number, ScreenLineEntity>;
  isViewRender: boolean;
  isSubFormRender: boolean;
}
const workflowModule: Module<WorkflowState, RootState> = {
  state: {
    screenModel: {} as ScreenModel,
    subFormModel: {} as ScreenModel,
    rowsEntity: new Map() as Map<number, ScreenLineEntity>,
    isViewRender: false,
    isSubFormRender: false,
  },
  actions: {
    saveCapturedValue(context, payload: CapturedValue) {
      context.commit("saveCapturedValue", payload);
    },
    onCancel(context) {
      const request = {} as EngineRequset;
      request.actionKey = ActionKeyEnum.CANCEL;
      request.capturedValues = [];
      request.userSettingDto = {} as UserSettingDto;
      request.screenDepth = 0;
      post(request).then((data) => {
        context.commit("onSubmit", data);
      });
    },
    onSubmit(context) {
      const request = {} as EngineRequset;
      request.actionKey = ActionKeyEnum.SUBMIT;
      request.capturedValues = [];
      request.userSettingDto = {} as UserSettingDto;
      request.screenDepth = 0;
      context.state.screenModel.capturedValues.forEach((cv: CapturedValue) => {
        const capturedValue = {} as CapturedValue;
        capturedValue.attributeName = cv.attributeName;
        capturedValue.value = cv.value;
        request.capturedValues.push(capturedValue);
      });
      post(request).then((data) => {
        context.commit("onSubmit", data);
      });
    },
  },
  mutations: {
    saveRenderStatus(state, payload) {
      state.isViewRender = payload;
    },
    saveSubFormRenderStatus(state, payload) {
      state.isSubFormRender = payload;
      state.isViewRender = true;
    },
    saveCapturedValue(state, payload: CapturedValue) {
      state.screenModel.capturedValues.forEach((capturedValue) => {
        if (capturedValue.attributeName == payload.attributeName) {
          capturedValue.value = payload.value;
        }
      });
      state.isViewRender = false;
    },
    onSubmit(state, payload) {
      state.isViewRender = true;
      state.screenModel.focus = "";
      state.screenModel.capturedValues = [];
      state.screenModel = composeScreenData(payload);
    },
    saveSubForm(state, payload) {
      state.isViewRender = true;
      state.screenModel = _.cloneDeep(state.screenModel);
      state.subFormModel = composeScreenData(payload);
    },
    clearSubForm(state, payload) {
      state.subFormModel = {} as ScreenModel;
      state.isViewRender = true;
    },
    nextFocus(state, payload) {
      state.screenModel.capturedValues.forEach((t: any, index: number) => {
        if (t.attributeName == payload.attributeName) {
          if (payload.direction == "up") {
            if (index - 1 > -1) {
              state.screenModel.focus =
                state.screenModel.capturedValues[index - 1].attributeName;
            }
          } else {
            if (index + 1 < state.screenModel.capturedValues.length)
              state.screenModel.focus =
                state.screenModel.capturedValues[index + 1].attributeName;
          }
        }
      });
      state.isViewRender = true;
    },
  },
  namespaced: true,
};
export default workflowModule;
