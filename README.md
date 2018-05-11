# SlideModalPicker 


A nice little wrapper for pickers. On iOS, they slide up from the bottom, and on Android the dialogs appear like normal. Only needs one implementation. Should save you some trouble.

Here's a link to the Github, you can look through files and stuff there: [https://github.com/philipshen/react-native-slide-modal-picker](https://github.com/philipshen/react-native-slide-modal-picker)

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

Here are some gifs so you get a feel for what it's like. It's the same code here for both iOS and Android; you can find it on Github here [(link)](https://github.com/philipshen/react-native-slide-modal-picker/blob/master/examples/App.js). It's highly customizable, so don't mind the ugliness. You can observe the default styles in the time picker (iOS) or anywhere (Android).

![Gif of iOS demo](https://imgur.com/gallery/4IfwZcb.gifv)
![Gif of android demo](https://imgur.com/gallery/3eLzH17.gifv)

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

#### Android only
**androidPickerCellStyle**: `object`
<br />
The style of the individual cell of the regular Android picker

**androidPickerCellTextStyle**: `object`
<br />
The style of the text in the cells of the regular Android picker

#### IOS only
**style**: `object` <br />Style of the actual picker

**title**: `string`

**titleStyle**: `object`

**padding**: `number` 
<br /> 
Just in case for whatever reason the modal' position isn't right (it should have a marginTop equal to the height of the screen), you can use this to change the padding.

#### The following are all the same as [DatePickerIOS](https://facebook.github.io/react-native/docs/datepickerios.html):

**maximumDate**: `Date`

**minimumDate**: `Date`

**minuteInterval**: `1|2|3|4|5|6|10|12|15|20|30`

**timeZoneOffsetInMinutes**: `number`

**locale**: `string`

