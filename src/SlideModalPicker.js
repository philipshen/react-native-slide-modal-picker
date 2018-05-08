import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePickerIOS, Picker, Dimensions, StyleSheet, Animated, Easing } from 'react-native'

export default class ModalPicker extends Component {

    _containerStyle;
    _pickerTranslation = new Animated.Value(0);
    state;

    // Initialize
    constructor(props) {
        super(props);

        this.state = {
            pickerHidden: true
        };

        // Dynamic styles, so we set em here
        let screenHeight = Dimensions.get('window').height;
        let screenWidth = Dimensions.get('window').width;
        this._containerStyle = {
            marginTop: screenHeight,
            width: screenWidth,
            height: 200,
            position: "absolute"
        }
    }


    // Render
    render() {
        const translation = this._pickerTranslation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -200],
        });

        return (
            <Animated.View
                style={[{transform: [{translateY: translation}]}, this._containerStyle]}
            >
                {this._renderAppropriatePicker()}
            </Animated.View>
        )
    }

    _renderAppropriatePicker() {
        const { pickerValue, type, onValueChange, style } = this.props;

        // PLATFORM-INDEPENDENT
        if (type === 'picker') {
            const { pickerItems } = this.props;

            return (
                <Picker
                    selectedValue={pickerValue}
                    style={[styles.picker, style]}
                    onValueChange={onValueChange}
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
                date={pickerValue}
                onDateChange={onValueChange}
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
        const { pickerHidden } = this.state;

        if (pickerHidden) {
            this.showPicker()
        } else {
            this.hidePicker()
        }

        this.setState({ pickerHidden: !pickerHidden })
    }

    showPicker() {
        const { pickerHidden } = this.state;
        if (pickerHidden === false) { return }
        this.setState({ pickerHidden: false });

        Animated.timing(this._pickerTranslation,
            {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
                // easing: Easing.out(Easing.linear)
            }
        ).start()
    }

    hidePicker() {
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

}

ModalPicker.propTypes = {
    type: PropTypes.oneOf(["time", "date", "datetime", "picker"]).isRequired,

    pickerValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.date
    ]),
    style: PropTypes.object,

    onValueChange: PropTypes.func,

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
        height: "100%",
        width: "100%"
    }
});