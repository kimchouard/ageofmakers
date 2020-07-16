/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { } from '../../../actions/index';
import { quizAnswerTypes } from '../../_utils';
import Markdown from './markdown';

class Quiz extends Component {
  constructor(props) {
      super(props);

      this.state = {
        questions: {},
        currentQuestionHelpers: null,
      }
  }

  componentDidMount() {
    let newQuestions = this.state.questions;

    for (let question of this.props.quizData.questions) {
      // If the question option is prepopulated for a URL, 
      if (question.prepopulated && question.type === quizAnswerTypes.URL) {
        newQuestions[question.id] = document.URL;
      }
    }
    
    this.setState({
      questions: newQuestions,
    });
  }

  submitQuestion(event) {
    this.props.saveQuiz(this.state.questions);
    event.preventDefault();
  }

  handleFormChange(e) {
    if (e && e.target && e.target.id) {
      let newQuestions = this.state.questions;
      newQuestions[e.target.id] = e.target.value;
      this.setState({
        questions: newQuestions,
      });
    }
    else {
      console.error('Invalid event for onChange form', e);
    }
  }

  renderSubmitBtn() {
    // We don't show the submit button if there's already results added in quiz data
    if (!this.props.quizData.results && this.props.saveQuiz) {
      return <div className="col-md-offset-3 submitWrapper">
        <input type="submit" className="btn btn-primary btn-lg" value="Submit" />
      </div>;
    }
  }

  needToRenderHelpers() {
    return (this.props.quizData.helpers && !this.props.quizData.results)
  }

  renderContentHelp(content) {
    if (content && !this.props.quizData.results) {
      return <div className={ `form-text` /* text-muted */ }>
        <Markdown mdContent={content} /> 
      </div>
    }
  }

  toggleQuestionHelpers(question) {
    if (this.state.currentQuestionHelpers === question.id) {
      this.setState({
        currentQuestionHelpers: null,
      });
    }
    else {
      this.setState({
        currentQuestionHelpers: question.id,
      });
    }
  }

  renderQuestionHelpers(question) {
    if (question.helpers) {
      return <div className="quizQuestionHelper">
        <div className="helpersToggle">
          <div className="btn btn-primary btn-sm" onClick={ () => { this.toggleQuestionHelpers(question); }}>
            { (this.state.currentQuestionHelpers === question.id) ? 'Close help' : 'Need more help?' }
          </div>
        </div>
        <div className="helpersContent" style={ {
          height: (this.state.currentQuestionHelpers === question.id) ? 'auto' : 0
        }}>
          <Markdown mdContent={question.helpers} /> 
        </div>
      </div>
    }
    
  }

  renderQuestions() {
    if (this.props.quizData.questions) {
      return <form name="quiz" className={`form-group quizForm col-${ (this.needToRenderHelpers()) ? '8' : '12' }`} onSubmit={(e) => { this.submitQuestion(e); }}>
        { this.props.quizData.questions.map((question) => {
          let quizResult;
          if (this.props.quizData.results) {
            quizResult = this.props.quizData.results[question.id];
          }

          let inputHtml;
          if (question.type === quizAnswerTypes.FREETEXT || question.type === quizAnswerTypes.FREETEXTLONG) {
            inputHtml = <textarea 
              placeholder={question.placeholder}
              id={question.id}
              className="form-control"
              required={ !question.optional }
              value={quizResult || this.state.questions[question.id]} 
              onChange={ (e) => { this.handleFormChange(e); } }
              rows={ (this.props.inline) ? "3" : (question.type === quizAnswerTypes.FREETEXTLONG) ? "20" : "5" }
              disabled={ (quizResult !== undefined) }
            />
          }
          else if (question.type === quizAnswerTypes.SMALLTEXT || question.type === quizAnswerTypes.URL) {
            inputHtml = <input 
              placeholder={question.placeholder}
              id={question.id}
              className="form-control"
              required={ !question.optional }
              value={quizResult || this.state.questions[question.id]} 
              onChange={ (e) => { this.handleFormChange(e); } }
              type={ (question.type === quizAnswerTypes.URL) ? 'url' : 'text' }
              disabled={ (quizResult !== undefined) }
            />
          }

          return <div className="form-group question row" key={question.id}>
            <label
              htmlFor={question.id}
              className={
                `col-md-${(this.props.inline || question.type === quizAnswerTypes.FREETEXTLONG) ? '12': '3'}
                ${ (question.type === quizAnswerTypes.FREETEXTLONG) ? 'text-left' : '' }
                col-form-label
                ${ (question.optional) ? '' : 'required' }`
              }
              title={question.name}
            >
              <Markdown mdContent={question.name} />
            </label>
            <div className={ `col-md-${(this.props.inline || question.type === quizAnswerTypes.FREETEXTLONG) ? '12': '9'}` }>
              { this.renderContentHelp(question.instructions) }
              { inputHtml }
              { this.renderContentHelp(question.examples) }
              { this.renderQuestionHelpers(question) }
            </div>
          </div>
        }) }

        { this.renderSubmitBtn() }
      </form>
    }
    else {
      console.error('No questions defined for quiz.', this.props.quizData);
    }
  }


  renderHelpers() {
    if (this.needToRenderHelpers()) {
      return <div className={`quizHelpers col-4`}>
        <Markdown mdContent={this.props.quizData.helpers} />
      </div>;
    }
  }
  render() {
    if (this.props.quizData) {
      return <div className={ `row quizWrapper ${(this.props.inline) ? 'inline': 'embedded'} ${ (this.props.quizData.results) ? 'quizResults' : ''}`}>
        { (this.props.inline) ? <div className="quizHeader col-12">Answer these questions to complete the quest.</div> : ''}
        { this.renderQuestions() }
        { this.renderHelpers() }
      </div>
    }
    else {
      return <div>Loading</div>
    }  
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
