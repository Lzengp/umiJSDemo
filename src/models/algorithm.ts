const model = {
  namespace: 'algorithm',

  state: {
    algorithmObj: {},
  },

  effects: {
    *fetchAlgorithmObj({ payload }: { payload: any }, { call, put }: { call: any; put: any }) {
      yield put({ type: 'save', payload: { algorithmObj: { ...payload } } });
    },
  },

  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
};

export default model;
