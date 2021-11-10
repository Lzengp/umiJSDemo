
import React, { Component, Fragment } from 'react';

/**高阶组件简单例子 */
class Hello extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <h4>hello Jason</h4>
    }
}
export default WrapperHello(Hello);


function WrapperHello(Comp) {
    class WrapComp extends React.Component {
        render() {
            return (
                <div>
                    <p>这是react高阶组件特有的元素</p>
                    <Comp {...this.props} name={'longwei'}></Comp>
                </div>
            )
        }
    }
    return WrapComp;
}