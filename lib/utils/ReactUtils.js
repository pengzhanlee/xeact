'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDisplayName = getDisplayName;
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}