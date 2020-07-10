import React, {Component} from 'react'
import Markdown from './markdown';

export default class Countdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hours: this.props.hours || 0,
      minutes: this.props.minutes || 0,
      seconds: this.props.seconds || 0,
      timerOn: this.props.autoPlay || false,
      currentPrompt: null,
    };
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
      if (this.state.timerOn) {
        const { seconds, minutes, currentPrompt } = this.state;
        if (seconds > 0) {
          this.setState(({ seconds }) => ({
            seconds: seconds - 1
          }))
        }
        if (seconds === 0) {
          if (minutes === 0) {
            console.log('Timer done!');
            this.pauseTimer();
            this.player.play();
          } else {
            this.setState(({ minutes }) => ({
              minutes: minutes - 1,
              seconds: 59,
              currentPrompt: this.getNewRandomPrompt(currentPrompt)
            }))
          }
        }
        else if (seconds === 30) {
          this.setState({
            currentPrompt: this.getNewRandomPrompt(currentPrompt),
          })
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  startTimer() {
    this.setState({
      timerOn: true,
    });
  }

  pauseTimer() {
    this.setState({
      timerOn: false,
    });
  }

  resetTimer(timerOn) {
    this.player.pause();
    this.setState({
      hours: this.props.hours || 0,
      minutes: this.props.minutes || 0,
      seconds: this.props.seconds || 0,
      timerOn: timerOn || false,
    });
  }

  getColorClass() {
    if (this.state.minutes === 0) {
      if (this.state.seconds === 0) {
        return 'color-empty';
      }
      else {
        return 'color-half';
      }
    }
    else {
      return 'color-full';
    }
  }

  toggleCountdownView() {
    this.setState({
      showCountdownUI: !this.state.showCountdownUI,
    })
  }

  renderTime(timeItem) {
    let timeItemValue = this.state[timeItem];
    if (timeItemValue < 10) {
      return "0" + timeItemValue;
    }
    else {
      return timeItemValue;
    }
  }

  renderCoundownLabel() {
    if (this.state.timerOn) {
      return <div>
        <span className="timer-btn" onClick={() => { this.pauseTimer() }}> ○ Pause</span> |
        <span className="timer-btn" onClick={() => { this.resetTimer() }}> ✖︎ Cancel</span>
      </div>
    }
    else if (this.state.hours === 0 && this.state.minutes === 0 && this.state.seconds === 0) {
      return <div>
      <span className="timer-btn" onClick={() => { this.resetTimer(true) }}>► Restart </span> |
      <span className="timer-btn" onClick={() => { this.resetTimer() }}> ✖︎ Stop</span>
    </div>
    }
    else {
      return <span className="timer-btn" onClick={() => { this.startTimer() }}>► Start </span>
    }
  }

  getNewRandomPrompt(currentPrompt) {
    if (this.props.prompts) {
      let newPrompt; 
      do {
        newPrompt = this.props.prompts[Math.round(Math.random() * (this.props.prompts.length - 1))];
      } while (currentPrompt === newPrompt) 
      return newPrompt;
    }
    else {
      return null;
    }
  }

  renderPrompts() {
    if (this.props.prompts && this.state.currentPrompt) {
      return <div className="countdownPrompts">
        <p className="title"><strong>Feeling stuck?</strong> Try to answer this prompt:</p>
        <blockquote className="blockquote">
          <Markdown mdContent={this.state.currentPrompt} />
        </blockquote>
      </div>
    }
  }
  
  render() {
    return (
      <div>
        <div className="countdown">
          <div className={ `tiles ${this.getColorClass() }` }>
            <span>{ this.renderTime('minutes') }:</span><span>{ this.renderTime('seconds') }</span>
          </div>
          <div className="countdown-label">{ this.renderCoundownLabel() }</div>
          <audio src={ chrome.extension.getURL(`/images/alarm-clock.mp3`) } type="audio/mpeg" ref={(ref) => { this.player = ref } }/>
        </div>
        { this.renderPrompts() }
      </div>
    );
  }
}