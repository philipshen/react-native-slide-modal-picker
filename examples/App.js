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
                    <Button title={regValue} onPress={() => this._showPicker(this._regPicker)}/>
                    <Button title={this._dateString(dateValue)} onPress={() => this._showPicker(this._datePicker)}/>
                    <Button title={this._timeString(timeValue)} onPress={() => this._showPicker(this._timePicker)}/>
                    <Button title={this._dateTimeString(datetimeValue)} onPress={() => this._showPicker(this._datetimePicker)}/>
                </View>
                <Picker
                    type={"picker"}
                    ref={ref => (this._regPicker = ref)}
                    pickerItems={["给我钱", "牛肉饭", "孔夫子说"]}
                    pickerValue={this.state.regValue}
                    initialValue={"孔夫子说"}
                    onValueChange={(val) => {
                        this.setState({regValue: val});
                    }}
                    headerStyle={{backgroundColor: "red"}}
                />
                <Picker
                    type={"date"}
                    ref={ref => (this._datePicker = ref)}
                    pickerValue={this.state.dateValue}
                    initialValue={new Date(2000, 3, 12)}
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

    _showPicker(picker) {
        picker.showPicker()
    }

    _timeString(date) {
        let minutes = date.getMinutes() + '';
        minutes = minutes.length === 2 ? minutes : new Array(2 - minutes.length + 1).join('0') + minutes;
        return `${date.getHours()}:${date.getMinutes()}`
    }

    _dateString(date) {
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
    }

    _dateTimeString(date) {
        let minutes = date.getMinutes() + '';
        minutes = minutes.length === 2 ? minutes : new Array(2 - minutes.length + 1).join('0') + minutes;
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}, ${date.getHours()}:${minutes}`
    }

}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 50,
        justifyContent: "space-between",
        alignItems: "center",
        height: 200
    }
});