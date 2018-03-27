export function getDisplayName(WrappedComponent) {

  if (!WrappedComponent) return null;

  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component';
}

/**
 * 查找被包裹的组件
 * @param Component
 * @returns {*}
 */
export function findWrappedComponentFromHOC(Component) {

  if (Component.Naked) {
    return findWrappedComponentFromHOC(Component.Naked);
  } else if (Component.WrappedComponent) {
    return findWrappedComponentFromHOC(Component.WrappedComponent);
  }

  return Component;
}

/**
 * 查找 HOC 最内层组件的 propTypes
 * @param Component
 * @returns {*|{}}
 */
export function findPropTypesFromHOC(Component) {

  Component = findWrappedComponentFromHOC(Component);

  return Component.propTypes || {};

}
