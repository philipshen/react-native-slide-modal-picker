import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePickerIOS, Picker, DatePickerAndroid, TimePickerAndroid,
         Dimensions, StyleSheet, Animated, Platform,
         View, Button, Text, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'

export default class ModalPicker extends Component {

    _isIOS = Platform.OS === 'ios';
    _isModalPicker; // If IOS or Android regular picker, we make a custom modal for it

    // IOS only, for the sliding animation
    _slidePickerStyle;
    _pickerTranslation = new Animated.Value(0);

    // Initialize
    constructor(props) {
        super(props);

        this._isModalPicker = this._isIOS || props.type === "picker";

        // Initial value
        let initialValue = props.initialValue;
        if (initialValue == null) {
            if (props.type === "picker") {
                initialValue = props.pickerItems[0];
            } else {
                initialValue = new Date()
            }
        }
        this.state = {
            pickerVisible: false,
            currentValue: initialValue,
            // The value that will be displayed when the modal is opened
            initialValue: initialValue,
        };

        // What follows is all IOS-specific
        if (!this._isIOS) { return; }

        // Padding
        const padding = props.padding === undefined ? 0 : props.padding;
        const screenHeight = Dimensions.get('window').height;
        const screenWidth = Dimensions.get('window').width;
        this._slidePickerStyle = {
            marginTop: screenHeight - padding,
            width: screenWidth,
            height: 250,
            position: "absolute",
        }
    }

    render() {
        // The android date/time pickers are native dialogs, not custom modals, so we don't render anything for them.
        if (!this._isModalPicker) { return null }

        return (
            <Modal
                visible={this.state.pickerVisible}
                transparent={true}
                onRequestClose={() => {}}
            >
                {this._isIOS === false ?  this._renderAndroidPicker() : this._renderIOSPicker()}
                <TouchableWithoutFeedback onPress={() => this._hideModalPicker()}>
                    <View style={styles.modalOverlay}/>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    _renderIOSPicker() {
        const { type } = this.props;
        const { currentValue } = this.state;

        let pickerContents;

        if (type === 'picker') {
            const { pickerItems } = this.props;

            pickerContents = (
                <Picker
                    selectedValue={currentValue}
                    style={[styles.picker, this.props.style]}
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
        } else {
            const {minimumDate, maximumDate, locale, timeZoneOffsetInMinutes} = this.props;
            pickerContents = (
                <DatePickerIOS
                    style={[styles.picker, this.props.style]}
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

        const translation = this._pickerTranslation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -250],
        });
        return (
            <Animated.View
                style={[{transform: [{translateY: translation}]}, this._slidePickerStyle]}
            >
                <View style={[styles.pickerHeader, this.props.headerStyle]}>
                    <Button
                        title={"Cancel"}
                        onPress={() => {
                            this._hideModalPicker();
                            // Reset the current value
                            this.setState({currentValue: this.state.initialValue});
                        }}
                    />
                    <Text style={this.props.titleStyle}>{this.props.title}</Text>
                    <Button
                        title={"Done"}
                        onPress={() => {
                            this._hideModalPicker();
                            // Set the initial value to the selected value
                            this.setState({initialValue: this.state.currentValue});

                            this.props.onValueChange(this.state.currentValue);
                        }}
                    />
                </View>
                {pickerContents}
            </Animated.View>
        )

    }

    _renderAndroidPicker() {
        const { pickerItems } = this.props;
        const pickerComponents = pickerItems.map((item) => {
            return (
                <TouchableOpacity key={item}
                                  activeOpacity={0.7}
                                  onPress={() => {
                                      this.props.onValueChange(item);
                                      this._hideModalPicker()
                                  }}
                >
                    <View style={[styles.androidPickerCell, this.props.androidPickerCellStyle]}>
                        <Text style={[this.props.androidPickerCellTextStyle, styles.androidPickerCellText]}>
                            {item}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });

        return (
            <View style={styles.regPickerAndroid}>
                {pickerComponents}
            </View>
        )
    }

    // Control
    togglePicker() {
        if (!this._isModalPicker) { return; }
        const { pickerVisible } = this.state;

        if (pickerVisible) {
            this._hideModalPicker()
        } else {
            this.showPicker( )
        }

        this.setState({ pickerVisible: !pickerVisible })
    }

    showPicker() {
        if (this._isModalPicker) {
            this._showModalPicker();
            return
        }

        this._showPickerAndroid();
    }

    // Utility
    _hideModalPicker() {
        // If not a modal picker, return
        if (!this._isModalPicker) { return }

        const { pickerVisible } = this.state;
        if (!pickerVisible) { return }

        if (this._isIOS) {
            Animated.timing(
                this._pickerTranslation,
                {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }
            ).start(() => {
                this.setState({pickerVisible: false});
            })
        } else {
            this.setState({pickerVisible: false})
        }
    }

    _showModalPicker() {
        const { pickerVisible } = this.state;
        if (pickerVisible === true) { return }
        this.setState({ pickerVisible: true });

        if (this._isIOS) {
            Animated.timing(this._pickerTranslation,
                {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }
            ).start()
        }
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

    // Android date/time pickers
    async _showDatePickerAndroid(): null {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                mode: "default",
                date: this.state.initialValue
            });

            if (action !== DatePickerAndroid.dismissedAction) {
                const chosenDate = new Date(year, month, day);
                this.props.onValueChange(chosenDate);
                this.setState({initialValue: chosenDate})
            }
        }
        catch({ code, message }) {
            console.warn(`${code}: Cannot open the date picker ${message}`);
        }
    }

    async _showTimePickerAndroid(): null {
        try {
            const now = this.state.initialValue;
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: now.getHours(),
                minute: now.getMinutes(),
                is24Hour: false
            });

            if (action !== TimePickerAndroid.dismissedAction) {
                const chosenDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
                this.props.onValueChange(chosenDate);
                this.setState({initialValue: chosenDate})
            }
        }
        catch ({ code, message }) {
            console.warn(`${code}: Cannot open the time picker ${message}`);
        }
    }

    async _showDateTimePickerAndroid(): null {
        try {
            const now = this.state.initialValue;
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

            this.props.onValueChange(chosenDate);
            this.setState({initialValue: chosenDate})
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
        PropTypes.instanceOf(Date)
    ]),
    style: PropTypes.object,

    // For the picker
    pickerItems: PropTypes.arrayOf(PropTypes.string),

    onValueChange: PropTypes.func,

    // ANDROID ONLY
    androidPickerCellStyle: PropTypes.object,
    androidPickerCellTextStyle: PropTypes.object,

    // IOS ONLY
    headerStyle: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    padding: PropTypes.number,

    // For the date/time/datetime
    maximumDate: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date),
    minuteInterval: PropTypes.oneOf(["1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30"]),
    timeZoneOffsetInMinutes: PropTypes.number,
    locale: PropTypes.string,
};

const styles = StyleSheet.create({
    modalOverlay: {
        backgroundColor: "black",
        opacity: 0.5,
        height: "100%",
        width: "100%",
        position: "absolute",
        zIndex: -1
    },
    picker: {
        width: "100%",
        backgroundColor: "white"
    },
    pickerHeader: {
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#CBD0D6",
        backgroundColor: "#EFEFF4"
    },
    regPickerAndroid: {
        width: "100%",
        marginTop: 150,
    },
    androidPickerCell: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: "#EFEFEF",
        marginHorizontal: 50,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    androidPickerCellText: {
        fontSize: 15,
        color: "black"
    }
});