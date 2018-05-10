# SlideModalPicker 


A nice little wrapper for pickers. On iOS, they slide up from the bottom, and on Android the dialogs appear like normal. Only needs one implementation. Should save you some trouble.

On Android these only work for date/time/datetime pickers right now, and not the regular ol' pickers. I might try to figure that out later, but seeing as how it's super easy to just implement the regular picker on Android––much easier than to implement it into this package, anyways––don't count on it.

I'm not going to spend much (read: any, unless there's an issue or something) time on this––I made it for personal use and (based on a few Google searches) decided publishing it would fill a hole––so it might be safer for you to just go into the source code and copy and paste it into your project rather than adding the npm package. It's some 200 lines of code, pretty simple. With that said, here's how to use it.

Also, I'm well aware that the name kinda blows.

## Usage

### Example
Like always, do `yarn add react-native-slide-modal-picker` or `npm install react-native-slide-modal-picker --save`

Then just go ahead and use it like so. Here's an example of a date and time picker:

    import React, { Component } from 'react';
    import {
        View,
        Button
    } from 'react-native';
    
    import Picker from 'react-native-slide-modal-picker'
    
    export default class App extends Component {
    
        _datetimePicker;
    
        constructor(props) {
            super(props);
    
            this.state = {
                date: new Date(),
            }
        }
    
        render() {
            const { date } = this.state;
            const datestring = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
    
            return (
                <View>
                    <Button style={{marginTop: 50}}
                        title={datestring}
                        onPress={() => this._datetimePicker.togglePicker()}
                    />
    
                    <Picker
                        type={"datetime"}
                        initialValue={date}
                        onValueChange={(val) => {
                            this.setState({date: val});
                        }}
                        ref={ref => (this._datetimePicker = ref)}
                    />
                </View>
            );
        }
    }
    
That's all you need to implement it.

### Props

**type**: `"time"|"date"|"datetime"|picker` 
<br />
The type of picker, and the only required prop. Regular "picker" doesn't support Android.

**pickerItems**: `string[]`
<br />
For normal pickers only

**initialValue**: `string` for "picker", else `Date`
<br />
By default, either the first item in `pickerItems` or the current date (depending on the `type`) 

**onValueChange**: `(val) => void` <br />When a new date is selected.

**padding**: `number` 
<br /> 
By default, the iOS date picker's top margin is equal to the height of the screen. In many cases, however, its superview will not be the size of the entire screen; in these cases, this prop can be set to "push" the picker a little higher. For example, if you have a react-navigation header:
<br />

    import { Header } from 'react-navigation'
    import Picker from 'react-native-slide-modal-picker'
    ...
    <Picker
        ...
        padding={Header.HEIGHT}
    >

#### IOS Only
**style**: `object` <br />Style of the actual picker

**title**: `string`

**titleStyle**: `object`

#### The following are all the same as [DatePickerIOS](https://facebook.github.io/react-native/docs/datepickerios.html):

**maximumDate**: `Date`

**minimumDate**: `Date`

**minuteInterval**: `1|2|3|4|5|6|10|12|15|20|30`

**timeZoneOffsetInMinutes**: `number`

**locale**: `string`

