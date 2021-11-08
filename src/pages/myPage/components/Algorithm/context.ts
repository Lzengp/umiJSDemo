import { createContext  } from "react";

const val: { id: string, name: string } = {
    id: '',
    name: '',
}

export default createContext(val);