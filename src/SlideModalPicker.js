import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePickerIOS, Picker, DatePickerAndroid, TimePickerAndroid,
         Dimensions, StyleSheet, Animated, Easing, Platform,
         View, Button, Text } from 'react-native'

export default class ModalPicker extends Component {

    _containerStyle;
    _pickerTranslation = new Animated.Value(0);
    state;
    _isIOS = Platform.OS === 'ios';

    // Initialize
    constructor(props) {
        super(props);

        /// Android has a far different implementation
        if (!this._isIOS) { return; }

        // Initial value
        let currentValue;
        if (props.initialValue === undefined) {
            if (props.type === "picker") {
                currentValue = props.pickerItems[0];
            } else {
                currentValue = new Date()
            }
        }
        this.state = {
            pickerHidden: true,
            currentValue: props.initialValue
        };

        // Initial value of the picker (iOS only)

        // Dynamic styles, so we set em here
        let screenHeight = Dimensions.get('window').height;
        let screenWidth = Dimensions.get('window').width;
        this._containerStyle = {
            marginTop: screenHeight,
            width: screenWidth,
            height: 250,
            position: "absolute",
        }
    }


    // Render
    render() {
        const translation = this._pickerTranslation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -250],
        });

        if (!this._isIOS) { return null }

        return (
            <Animated.View
                style={[{transform: [{translateY: translation}]}, this._containerStyle]}
            >
                <View style={[styles.pickerHeader, this.props.headerStyle]}>
                    <Button
                        title={"Cancel"}
                        onPress={() => {
                            this.hidePicker()
                        }}
                    />
                    <Text style={this.props.titleStyle}>{this.props.title}</Text>
                    <Button
                        title={"Done"}
                        onPress={() => {
                            this.hidePicker();
                            this.props.onValueChange(this.state.currentValue)
                        }}
                    />
                </View>
                {this._renderIOSPicker()}
            </Animated.View>
        )
    }

    _renderIOSPicker() {
        const { type, style } = this.props;
        const { currentValue } = this.state;

        // PLATFORM-INDEPENDENT
        if (type === 'picker') {
            const { pickerItems } = this.props;

            return (
                <Picker
                    selectedValue={currentValue}
                    style={[styles.picker, style]}
                    onValueChange={(val) => {
                        this.setState({currentValue: val})
                    }}
                >
                    {pickerItems.map((val, key) => {
                        return (
                            <Picker.Item key={key} label={val} value={val} />
                        )
                    })}
                </Picker>
            )
        }

        const { minimumDate, maximumDate, locale, timeZoneOffsetInMinutes } = this.props;
        return (
            <DatePickerIOS
                style={[styles.picker, style]}
                date={currentValue}
                onDateChange={(date) => {
                    this.setState({currentValue: date})
                }}
                mode={type}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                locale={locale}
                timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
            />
        )

    }

    // Control
    togglePicker() {
        if (!this._isIOS) { return; }
        const { pickerHidden } = this.state;

        if (pickerHidden) {
            this.showPicker()
        } else {
            this.hidePicker()
        }

        this.setState({ pickerHidden: !pickerHidden })
    }

    showPicker() {
        if (this._isIOS) {
            this._showPickerIOS()
        } else {
            this._showPickerAndroid()
        }
    }

    // Android picker is a dialog that only dismisses itself
    hidePicker() {
        if (!this._isIOS) { return }

        const { pickerHidden } = this.state;
        if (pickerHidden === true) { return }
        this.setState({ pickerHidden: true });

        Animated.timing(
            this._pickerTranslation,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.quad
            }
        ).start()
    }

    // UTILITY
    _showPickerIOS() {
        const { pickerHidden } = this.state;
        if (pickerHidden === false) { return }
        this.setState({ pickerHidden: false });

        Animated.timing(this._pickerTranslation,
            {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }
        ).start()
    }

    _showPickerAndroid() {
        switch(this.props.type) {
            case "date":
                this._showDatePickerAndroid();
                break;
            case "time":
                this._showTimePickerAndroid();
                break;
            case "datetime":
                this._showDateTimePickerAndroid();
                break;
            default:
                break;
        }
    }

    async _showDatePickerAndroid() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                mode: "default",
                date: this.props.initialValue
            });

            if (action !== DatePickerAndroid.dismissedAction) {
                const chosenDate = new Date(year, month, day);
                this.props.onValueChange(chosenDate);
            }
        }
        catch({ code, message }) {
            console.warn(`${code}: Cannot open the date picker ${message}`);
        }
    }

    async _showTimePickerAndroid() {
        try {
            const now = this.props.initialValue;
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: now.getHours(),
                minute: now.getMinutes(),
                is24Hour: false
            });

            if (action !== TimePickerAndroid.dismissedAction) {
                const chosenDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
                this.props.onValueChange(chosenDate);
            }
        }
        catch ({ code, message }) {
            console.warn(`${code}: Cannot open the time picker ${message}`);
        }
    }

    async _showDateTimePickerAndroid() {
        try {
            const now = this.props.initialValue;
            const dateResults = await DatePickerAndroid.open({
                mode: "default",
                date: now
            });

            if (dateResults.action === DatePickerAndroid.dismissedAction) { return; }

            const timeResults = await TimePickerAndroid.open({
                hour: now.getHours(),
                minute: now.getMinutes(),
                is24Hour: false
            });

            if (timeResults.action === TimePickerAndroid.dismissedAction) { return; }

            const { year, month, day } = dateResults;
            const { hour, minute } = timeResults;
            const chosenDate = new Date(year, month, day, hour, minute);

            this.props.onValueChange(chosenDate)
        }
        catch ({ code, message }) {
            console.warn(`${code}: Cannot open date/time picker ${message}`)
        }
    }

}

ModalPicker.propTypes = {
    type: PropTypes.oneOf(["time", "date", "datetime", "picker"]).isRequired,

    initialValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.date
    ]),
    style: PropTypes.object,

    onValueChange: PropTypes.func,

    // IOS title & header
    headerStyle: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.object,

    // For the date/time/datetime
    maximumDate: PropTypes.date,
    minimumDate: PropTypes.date,
    minuteInterval: PropTypes.oneOf(["1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30"]),
    timeZoneOffsetInMinutes: PropTypes.number,
    locale: PropTypes.string,

    // For the picker
    pickerItems: PropTypes.arrayOf(PropTypes.string)
};

const styles = StyleSheet.create({
    picker: {
        width: "100%"
    },
    pickerHeader: {
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});