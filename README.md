# React Drag and Drop List
Light and customizable drag and drop list for React, with no additional dependencies.

# Demos
Coming soon...

# Getting started
### Install:
`npm install --save react-dnd-list`

### Import:
`import DnDList from 'react-dnd-list'`

### Create your item component:
```
const Item = props => {
  const dnd = props.dnd

  return (
    <li
      style={dnd.styles}
      className={dnd.classes}
      ref={dnd.ref}
      {...dnd.dragHandlers}
    >
      {props.item}
    </li>
  )
}
```
`dnd` props are essential for the drag and drop functionality. Assign `dnd.styles`, `dnd.classes`, and `dnd.ref` to the outer DOM component. Do not override `position`, `top` (or `left` if the list is horizontal) and `transition` styles of that component!

`dnd.dragHandlers` is an object containing two keys: `onMouseDown` and `onTouchStart`, with appropriate functions as values. Assign them to a component that should initiate drag on click or touch.

The `item` prop is just a value from your array of items (look below).

### Create your list component:
```
const MyList = () => {
  const [list, setList] = useState(['1', '2', '3'])

  return (
    <ul>
      <DnDList
        items={list}
        itemComponent={Item}
        setList={setList}
      />
    </ul>
  )
}
```
You need to provide `DnDList` with an array of items, its update function, and the item component (the one we created earlier).

That's it, you now have a functional drag and drop list!

# Customization
### Item component
You can use one more prop inside your item component: `inDrag`. It's a boolean, set to `true` when the item, you guessed it, is currently being dragged.

### List component
There are several props you can pass to `DnDList` to customize it:

Name | Type | Default | Description
--- | --- | --- | ---
disableTransitions | boolean | false | Disables swap transitions if set to `true`.
horizontal | boolean | false | Let's you swap items horizontally, from left to right, if set to `true`.

Function props:


Name | Args | Returns | Description
--- | --- | --- | ---
setSwapThreshold | size (number) | number | Let's you set a swap threshold for every item in the list individually, based on their size (height or width, depending on the type of the list). For example `(size) => size * 0.5` will result in elements being swapped after the dragged element has traversed more than 50% of their size.
setOverflowThreshold | size (number) | number | Function similar to `setSwapThreshold`. Let's you set how far the dragged item can be moved over the list container bounds, based on its (the dragged item) size. It's recommended for it to return value bigger than 0, to avoid otherwise very rare transition bug.


By default swap threshold is set to 1, and overflow threshold to 0.
