export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component';
}


export function findPropTypesFromInHOC(Component) {

    if(Component.Naked) {
        return findPropTypesFromInHOC(Component.Naked);
    } else if(Component.WrappedComponent) {
        return findPropTypesFromInHOC(Component.WrappedComponent);
    } else if(Component.propTypes) {
        return Component.propTypes;
    }

    return {};
}
