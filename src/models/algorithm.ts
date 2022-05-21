const model = {
  namespace: 'algorithm',

  state: {
    algorithmObj: {},
    countDownStr: '00:00',
    maxTime: 100,
  },

  effects: {
    *fetchAlgorithmObj({ payload }: { payload: any }, { call, put }: { call: any; put: any }) {
      yield put({ type: 'save', payload: { algorithmObj: { ...payload } } });
    },

    *fetchCountDownObj({ payload }: { payload: any }, { call, put }: { call: any; put: any }) {
      const { countDownStr, maxTime } = payload;
      yield put({ type: 'save', payload: { countDownStr, maxTime } });
    },
  },

  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
};

export default model;
