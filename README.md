# React Drag and Drop List
Light and customizable drag and drop list for React, with no additional dependencies.

# Demo
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
      style={{ ...dnd.item.styles, ...dnd.handler.styles }}
      className={dnd.item.classes}
      ref={dnd.item.ref}
      {...dnd.handler.listeners}
    >
      {props.item}
    </li>
  )
}
```
<<<<<<< HEAD
`dnd` props are essential for the drag and drop functionality. Assign `dnd.item.styles`, `dnd.item.classes`, and `dnd.item.ref` to the outer DOM component. Do not override `transform` and `transition` styles of that component!
=======
`dnd` props are essential for the drag and drop functionality. Assign `dnd.item.styles`, `dnd.item.classes`, and `dnd.item.ref` to the outer DOM component. Do not override `transform` and `transition` styles of that component! 
>>>>>>> baa96a5b51e2b170cafff78e3ae20414a360cbbd

`dnd.handler.listeners` is an object containing two keys: `onMouseDown` and `onTouchStart`, with appropriate functions as values. Together with `dnd.handler.styles`, assign it to a component that will initiate drag on click or touch.

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

# Mini Docs
### Item component
You have access to a few more props inside your item component:

Name | Types | Description
--- | --- | ---
itemInDrag | boolean | `true` if the item is being dragged.
listInDrag | boolean | `true` if any of the items in your list is being dragged.
index | number | Item's index in the list.
last | boolean | `true` if the item is last in the list.

### List component
There are several props you can pass to `DnDList` to customize it:

Name | Type | Default | Description
--- | --- | --- | ---
horizontal | boolean | false | Let's you swap items horizontally if set to `true`.
transitionStyles | object | – | Let's you override default CSS transition styles, for example `{ transtitionDuration: '0.5s' }`.
disableTransitions | boolean | false | Disables swap transitions if set to `true`.

Function props:


Name | Args | Returns | Description
--- | --- | --- | ---
setSwapThreshold | size (number) | number | Let's you set a swap threshold for every item in the list individually, based on their size (height or width, depending on the type of the list). For example `size => size * 0.5` will result in elements being swapped after the dragged element has traversed more than 50% of their size.
setOverflowThreshold | size (number) | number | Function similar to `setSwapThreshold`. Let's you set how far the dragged item can be moved over the list container bounds, based on its (the dragged item) size.


By default swap threshold is set to 1, and overflow threshold to 0.
