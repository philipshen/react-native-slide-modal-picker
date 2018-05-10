import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';

import Picker from '../src/SlideModalPicker'

export default class App extends Component<undefined> {

    _regPicker;
    _datePicker;
    _timePicker;
    _datetimePicker;

    constructor(props) {
        super(props);

        this.state = {
            regValue: "给我钱",
            dateValue: new Date(),
            timeValue: new Date(),
            datetimeValue: new Date()
        }
    }

    render() {
        const { regValue, dateValue, timeValue, datetimeValue } = this.state;

        return (
            <View>
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} title={regValue} onPress={() => this._showPicker(this._regPicker)}/>
                    <Button style={styles.button} title={this._datestring(dateValue)} onPress={() => this._showPicker(this._datePicker)}/>
                    <Button style={styles.button} title={this._datestring(timeValue)} onPress={() => this._showPicker(this._timePicker)}/>
                    <Button style={styles.button} title={this._datestring(datetimeValue)} onPress={() => this._showPicker(this._datetimePicker)}/>
                </View>
                <Picker
                    type={"picker"}
                    ref={ref => (this._regPicker = ref)}
                    pickerItems={["给我钱", "牛肉饭", "孔夫子说"]}
                    pickerValue={this.state.regValue}
                    onValueChange={(val) => {
                        this.setState({regValue: val});
                    }}
                    headerStyle={{backgroundColor: "red"}}
                />
                <Picker
                    type={"date"}
                    ref={ref => (this._datePicker = ref)}
                    pickerValue={this.state.dateValue}
                    onValueChange={(val) => {
                        this.setState({dateValue: val});
                    }}
                    style={{
                        backgroundColor: "blue"
                    }}
                    title={"Whoopti Scoop"}
                    titleStyle={{fontSize: 19}}
                    headerStyle={{borderTopWidth: 0.5}}
                />
                <Picker
                    type={"time"}
                    ref={ref => (this._timePicker = ref)}
                    pickerValue={this.state.timeValue}
                    onValueChange={(val) => {
                        this.setState({timeValue: val});
                    }}
                    style={{
                        borderTopWidth: 0.5,
                        borderColor: "#707070"
                    }}
                    padding={-40}
                />
                <Picker
                    type={"datetime"}
                    pickerValue={this.state.datetimeValue}
                    onValueChange={(val) => {
                        this.setState({datetimeValue: val});
                    }}
                    ref={ref => (this._datetimePicker = ref)}
                    padding={20}
                />
            </View>
        );
    }

    _hidePickers() {
        this._regPicker.hidePicker();
        this._datePicker.hidePicker();
        this._timePicker.hidePicker();
        this._datetimePicker.hidePicker();
    }

    _showPicker(picker) {
        this._hidePickers();
        picker.showPicker()
    }

    _datestring(date) {
        let minutes = date.getMinutes() + '';
        minutes = minutes.length == 2 ? minutes : new Array(2 - minutes.length + 1).join('0') + minutes;
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}, ${date.getHours()}:${minutes}`
    }

}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 50,
        justifyContent: "space-between",
        alignItems: "center",
    },
    button: {
        marginBottom: 10
    }
});