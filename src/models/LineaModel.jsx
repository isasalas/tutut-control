// Example usage:
//
// import { MyShape } from ./myShape.js;
//
// class MyComponent extends React.Component {
//   //
// }
//
// MyComponent.propTypes = {
//   input: MyShape
// };

import PropTypes from "prop-types";

let _Linea;
_Linea = PropTypes.shape({
    "id": PropTypes.string,
    "name": PropTypes.string,
    "description": PropTypes.string,
    "directionLat": PropTypes.string,
    "directionLon": PropTypes.string,
    "colorBg": PropTypes.string,
    "colorPr": PropTypes.string,
    "phone": PropTypes.string,
    "createdAt": PropTypes.string,
    "updatedAt": PropTypes.string,
});

export const LineaModel = _Linea;

export const LineasModel = PropTypes.arrayOf(_Linea);