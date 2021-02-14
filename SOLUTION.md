# **CoolCanvas - Solution**

## For Starters

*   Before starting I was only vaguely familiar with the canvas API. I has a brief idea of what it does, but I don't believe have ever used it before.
    
*   I based my starter off the starter provided by you - [https://github.com/stream-labs/frontend-assignment](https://github.com/stream-labs/frontend-assignment)
    
*   My primary focus was on building a clean and scalable solution. Styling was not a priority - but I have made provisions for SCSS component stylesheets.
    
*   I kept my commit history clean and well commented in the hopes to make my progress somewhat easy to parse through.
    

## The React Decision

I am still on the fence about this choice.

I decided to use create-react-app in order to quickly get a React TypeScript template up and running with minimal fuss.

Initially I assumed that the Canvas api would take in children HTML/JSX element, meaning I could easily encapsulate and componentise the different parts to the application - ie canvas wrapper, images, other rendered elements etc.

This is not quite the case - although I am relatively certain we can build our `Canvas` component to replicate this potentially -

> See comment in App.tsx ln 21

The next big strike was not realising how badly the React render cycle and the Canvas Render cycle play together.

React wants to be in full control of re-renders. But when using the Canvas API - you become responsible for it's render cycle. This means you have to do quite a bit of `useEffect` and `useCallback` magic to ensure both React and the Canvas render efficiently.

Once I had the _Side Effects (see Canvas.tsx ln 97)_ up and running efficiently in the `Canvas.tsx` this was not much of a problem anymore. I could focus on the Canvas render cycle without much hassle from React anymore.

> During development I had `console.logs` inside any render and lifecycle methods to ensure we were not rendering unnecessarily. See earlier commits.

Most of this trouble could have been avoided by using the started template provided by you directly. Then the only render cycle to manage would be the Canvas. However now the app can potentially scale more simply as building separate components and functionality may be easier to add going forward - all depending on use case though.

## Folder Structure

I tried to keep it simple for now, with the potential to scale to more folders later.

`src/assets` - any assets

`src/components` - any React components. This could be separated into shared components and non-shared components at a later stage if needed.

`src/utils` - Any shared utility methods, interfaces, classes, hooks, etc

## Commit Highlights

### **[Init commit. All functionality from StreamLabs template ported](https://github.com/matthewmullin01/coolcanvas/commit/99825208940dc87b7d047a2a45bdf82767501ebc)**

Canvas.tsx contains the bulk of the functionality found in the starter project. Image utils were moved to the `utils` folder for better reuse.

useWindowSize.ts hook was added in this commit - although it will only be used in the next commit to make the canvas responsive.

### **[Window resize with debounce for performance added](https://github.com/matthewmullin01/coolcanvas/commit/99825208940dc87b7d047a2a45bdf82767501ebc)**

The lodash debounce function was added to improve performance by limiting the number of calls to re-render within a time frame. Lag was especially noticeable when resizing the chrome dev tools window. Although when resizing the window normally it was not too bad. More investigation would be needed to check the usefulness of this.

The useEffect only handle the window resize event via the `useWindowSize.ts` hook, meaning we can call any responsive sizing in this useEffect.

### **[Moved LoadImage out of render for Performance](https://github.com/matthewmullin01/coolcanvas/commit/56a1621c2e1a994374c5de5978ab8ad4e1dbdd77)**

Each render call was reloading the images from src. By moving this logic up to the wrapper component we improve performance. It also means we can pass in new canvas element from the parent element which makes more sense intuitively.

### **[Wrapping images in custom class to help manage logic and state](https://github.com/matthewmullin01/coolcanvas/commit/f80aafd010cfc669d180fbedd96f7762eb4e1895)**

After digging into the Canvas API I realised it would not be possible to find and mutate children rendered in the canvas directly. Essentially all the Canvas does is paint pixels.

This meant that we would have to manage the state (position, size, drag state, etc) of the rendered elements ourselves.

```
export class CanvasElement {
  canvasImageSource: CanvasImageSource;
  center: Vector2D;

  ...
```

To help this process I created a class that would wrap any rendered element. It would hold a reference to the paintable image in `canvasImageSource` and also the state of the element (eg the `center` position). More attributes were added to this class later.

The `Vector2D` class is also a utility class added to hold positional data. It makes doing vector manipulation and maths simpler going forward.

### **[Wrapping canvas in custom class to manage canvas state and elements](https://github.com/matthewmullin01/coolcanvas/commit/f74f74229fd32d98d0a88e649dedc60b6e729e41)**

Now that we could manage the state of each rendered element in a scalable way it was time to do the same for canvas itself.

The CanvasWrapper class holds a reference to all rendered elements `canvasElements` as well as the `HTMLCanvasElement` itself.

```
export class CanvasWrapper {
  canvas: HTMLCanvasElement;
  canvasElements: CanvasElement[];
```

It also has various helper methods (`render`,`drawImages` , etc) which meant we could clean up our `Canvas.tsx` component.

> From this point onwards it was very simple to build functionality as we were managing state in a simple way, and we had clear boundaries between our components.

### Drag Functionality

[Working drag functionality](https://github.com/matthewmullin01/coolcanvas/commit/945a192279a87767440cbc0987da7a7096b10b8a)

[Drag offset set to cursor position](https://github.com/matthewmullin01/coolcanvas/commit/ad8cfa3f9c6534a30d0ccd2dcb5c662c21b4c9cb)

[Drag offset cleanup](https://github.com/matthewmullin01/coolcanvas/commit/acd34b459108d1dea1f921247bc6cf97b078076d)

This was relatively simple. The drag state of each element was handled in the `CanvasElement` . The `CanvasWrapper` also held a reference to the dragged element to make conditional logic simpler.

Initially my approach was to check if cursor was inside an elements bounding box when clicked. If it was we would set the new center of the image to where the cursor is, until the mouse is unclicked.

This however caused the images center to jump to the cursor. I added a `draggingOffset` to the element so that when dragging we can add this offset to the cursor position to prevent this jumping.

> I focussed on creating as few writable properties as possible. Most class properties are dynamically computed and readonly/getters which makes working with the logic simpler, but also means that updating state is very simple as we only have a few setters.
> 
> eg The `center` position is the only property the controls the element position. All edges and corners are computed using the `center` together with the width and height.

### Image Overflow

[Handling image overflow](https://github.com/matthewmullin01/coolcanvas/commit/64b6f57e6201477d07930bbb05c201bf112819bc)

I was in two minds as whether to put this functionality into the `CanvasWrapper` class as renders are internally handled there.

But my view is that handling overflow is solution specific. Some canvas' may want it and some not. Therefore I left the logic in the `Canvas.tsx` component within the Event Handlers.

[Window resize image overflow fix](https://github.com/matthewmullin01/coolcanvas/commit/c3df02e9c7b035b53d331dda19a68364c5d06e0c)

When resizing the window, elements could render beyond the canvas bounds. I just added a `handleImageOverflow` to the resize listener to solve this.

### Green Border

[Added border to dragged element](https://github.com/matthewmullin01/coolcanvas/commit/192546af98bea29b3d8fdde1b0512ec02082dfef)

Again as we are tracking the Canvas element and their state within the `CanvasWrapper` this was quite straight forward.

Although it is technically not a border - as I am drawing a Green rectangle 2px wider in all direction and then laying the image on top of that, it effectively does the same thing.

An alternative would be to use Canvas' `Path2D.moveTo()` and `Path2D.lineTo()` - but it would require quite a bit more logic.

## Answers to Questions

**How long did it take you to complete this assignment?**

Around 7 hours of active work.

I admit I may have got a little carried away 🙈. I had a ton of fun doing the assignment and I valued learning the ins and outs of the Canvas API so I was more than happy to do so.


**What about this assignment did you find most challenging?**

Finding a way to efficiently managing the render cycles between React and the Canvas API.

**What about this assignment did you find unclear?**

Hardly anything. It was very well laid out and as clear as ever.

**What challenges did you face that you did not expect?**

Again the render cycle management. This could easily have been alleviated had I dug into the Canvas API docs before diving head first into framing the solution. Then I may have decided against using a framework as this solution primarily involves handling the Canvas API and surrounding state.

**Do you feel like this assignment has an appropriate level of difficulty?**

The concept was simple - and I can see the solution allowed the flexibility to solve it in multiple ways. Great question in my opinion.

**Briefly explain your decisions to use tools, frameworks and libraries like React, Vue, etc.**

See [The React Decision](#the-react-decision) above.