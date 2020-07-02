/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeEmbeddedQuest } from '../../../actions/index';
import { quizAnswerTypes } from '../../_utils';
import Markdown from './markdown';

class Quiz extends Component {
  constructor(props) {
      super(props);

      this.state = {
        questions: {}
      }
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
        questions: newQuestions
      });
    }
    else {
      console.error('Invalid event for onChange form', e);
    }
  }

  renderSubmitBtn() {
    // We don't show the submit button if there's already results added in quiz data
    if (!this.props.quizData.results) {
      return <div className="col-md-offset-3 submitWrapper">
        <input type="submit" className="btn btn-primary btn-lg" value="Submit" />
      </div>;
    }
  }

  renderQuestions() {
    const validateMessages = {
      required: 'This field is required!',
    }

    if (this.props.quizData.questions) {
      return <form name="quiz" className="form-group quizForm col-12" onSubmit={(e) => { this.submitQuestion(e); }}>
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
              required
              value={quizResult || this.state.questions[question.id]} 
              onChange={ (e) => { this.handleFormChange(e); } }
              rows={ (this.props.inline) ? "3" : (question.type === quizAnswerTypes.FREETEXTLONG) ? "10" : "5" }
              disabled={ (quizResult !== undefined) }
            />
          }
          else if (question.type === quizAnswerTypes.SMALLTEXT) {
            inputHtml = <input 
              placeholder={question.placeholder}
              id={question.id}
              className="form-control"
              required
              value={quizResult || this.state.questions[question.id]} 
              onChange={ (e) => { this.handleFormChange(e); } }
              type="text"
              disabled={ (quizResult !== undefined) }
            />
          }

          return <div className="form-group question row" key={question.id}>
            <label htmlFor={question.id} className={`col-md-${(this.props.inline) ? '12': '3'} col-form-label required`} title={question.name}>
              <Markdown mdContent={question.name} />
            </label>
            <div className={ `col-md-${(this.props.inline) ? '12': '9'}` }>
              { inputHtml }
              { (!question.examples || this.props.quizData.results) ? '' : <small className={ `form-text` /* text-muted */ }>
                <Markdown mdContent={question.examples} /> 
              </small> }
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

  render() {
    if (this.props.quizData) {
      return <div className={ `row quizWrapper ${(this.props.inline) ? 'inline': 'embedded'} ${ (this.props.quizData.results) ? 'quizResults' : ''}`}>
        { (this.props.inline) ? <div className="quizHeader col-12">Answer these questions to complete the quest.</div> : ''}
        { this.renderQuestions() }
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
return bindActionCreators({ closeEmbeddedQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
