# SlideModalPicker 


A nice little wrapper for pickers. On iOS, they slide up from the bottom, and on Android the dialogs appear like normal. Only needs one implementation. Should save you some trouble.

On Android these only work for date/time/datetime pickers right now, and not the regular ol' pickers. I might try to figure that out later, but seeing as how it's super easy to just implement the regular picker on Android––much easier than to implement it into this package, anyways––don't count on it.

I'm not going to spend much (read: any, unless there's an issue or something) time on this––I made it for personal use and (based on a few Google searches) decided publishing it would fill a hole––so it might be safer for you to just go into the source code and copy and paste it into your project rather than adding the npm package. It's some 200 lines of code, pretty simple. With that said, here's how to use it.

Also, I'm well aware that the name kinda blows.

## Usage

Like always, do `yarn add react-native-slide-modal-picker` or `npm install react-native-slide-modal-picker --save`

Then just go ahead and use it like so. Here's an example of a date and time picker:

