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
import MusicTheoryQuiz from './musicTheoryQuiz';

class Quiz extends Component {
  constructor(props) {
      super(props);

      this.state = {
        questions: {},
        currentQuestionHelpers: [],
        editQuiz: false,
        loading: false,
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
    this.setState({ loading: true, editQuiz: false });
    this.props.saveQuiz(this.state.questions, this.state.editQuiz);
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

  musicQuizCompleted(questionId) {
    if (questionId) {
      let newQuestions = this.state.questions;
      newQuestions[questionId] = true;
      this.setState({
        questions: newQuestions,
      });
    }
    else {
      console.error('Invalid event for onChange form', e);
    }
  }

  hasQuizResult() {
    // If the results are in the quiz data or passed directly in the quizResults parameter
    return this.props.quizData.results || this.props.quizResults;
  }

  getQuizResults(questionId) {
    if (this.props.quizData.results) {
      return this.props.quizData.results[questionId];
    }
    else if (this.props.quizResults) {
      return this.props.quizResults[questionId];
    }
    else {
      console.log('No quiz results to show for the quiz.', this.props.quizData, this.props.quizResults)
    }
  }

  startEditingQuiz() {
    this.setState({ editQuiz: true, questions: this.props.quizData.results || this.props.quizResults });
  }

  renderSubmitBtn() {
    // We don't show the submit button if there's already results added in quiz data
    if (!this.hasQuizResult() && this.props.saveQuiz) {
      return <div className="col-md-offset-3 submitWrapper">
        <input type="submit" className={ `btn btn-primary btn-lg ${ (this.state.loading) ? 'loader' : ''}` } value="Submit" />
      </div>;
    }
    // We show custom buttons if we're embedding results
    else if ((this.props.embeddedPage && this.props.embeddedPage.viewOrderId === -1) || this.props.editable) {
      return <div>
        <div className="col-md-offset-3 submitWrapper">
          {(!this.state.editQuiz) ? <button className={ `btn btn-dark ${ (!this.props.editable) ? 'btn-lg' : ''} edit-btn` } onClick={() => { this.startEditingQuiz() }}>Edit</button> : ''} 
          {(!this.props.editable || this.state.editQuiz) ? <input type="submit" className={ `btn btn-primary ${ (!this.props.editable) ? 'btn-lg' : ''} edit-btn ${ (this.state.loading) ? 'loader' : ''}` } value={(this.state.editQuiz) ? 'Save' : 'Next'} /> : ''}
        </div>
      </div>
    }
  }

  needToRenderHelpers() {
    return (this.props.quizData.helpers && !this.hasQuizResult())
  }

  renderContentHelp(content) {
    if (content && !this.hasQuizResult()) {
      return <div className={ `form-text` /* text-muted */ }>
        <Markdown mdContent={content} /> 
      </div>
    }
  }

  toggleQuestionHelpers(question) {
    if (this.state.currentQuestionHelpers[question.id]) {
      let newCurrentQuestionHelpers = this.state.currentQuestionHelpers;
      newCurrentQuestionHelpers[question.id] = false;
      this.setState({
        currentQuestionHelpers: newCurrentQuestionHelpers,
      });
    }
    else {
      let newCurrentQuestionHelpers = this.state.currentQuestionHelpers;
      newCurrentQuestionHelpers[question.id] = true;
      this.setState({
        currentQuestionHelpers: newCurrentQuestionHelpers,
      });
    }
  }

  renderQuestionHelpers(question) {
    if (question.helpers && !this.hasQuizResult()) {
      return <div className="quizQuestionHelper">
        <div className="helpersToggle">
          <div className="btn btn-dark btn-sm" onClick={ () => { this.toggleQuestionHelpers(question); }}>
            { (this.state.currentQuestionHelpers[question.id]) ? 'Close Help' : question.helperText || 'Need more help?' }
          </div>
        </div>
        <div className="helpersContent" style={ {
          height: (this.state.currentQuestionHelpers[question.id]) ? 'auto' : 0
        }}>
          <Markdown mdContent={question.helpers} /> 
        </div>
      </div>
    }
  }

  isDisabled(quizResult) {
    return (quizResult !== undefined && !this.state.editQuiz);
  }

  getQuizValue(questionId, quizResult) {
    if (quizResult && !this.state.editQuiz) {
      return quizResult;
    } 
    else {
      return this.state.questions[questionId];
    }
  }

  renderQuestions() {
    if (this.props.quizData.questions) {
      return <form name="quiz" className={`form-group quizForm col-${ (this.needToRenderHelpers()) ? '8' : '12' }`} onSubmit={(e) => { this.submitQuestion(e); }}>
        { this.props.quizData.questions.map((question) => {
          if (question.type === quizAnswerTypes.MUSICTHEORY) {
            return <MusicTheoryQuiz question={question} musicQuizCompleted={() => { this.musicQuizCompleted(question.id) }} />
          } 
          else {
            let quizResult;
            if (this.hasQuizResult()) {
              quizResult = this.getQuizResults(question.id);
            }

            let inputHtml;
            if (question.type === quizAnswerTypes.FREETEXT || question.type === quizAnswerTypes.FREETEXTLONG) {
              inputHtml = <textarea 
                placeholder={question.placeholder}
                id={question.id}
                className="form-control"
                required={ !question.optional }
                value={ this.getQuizValue(question.id, quizResult) } 
                onChange={ (e) => { this.handleFormChange(e); } }
                rows={ (this.props.inline) ? (question.type === quizAnswerTypes.FREETEXTLONG) ? "10" : "3" : (question.type === quizAnswerTypes.FREETEXTLONG) ? "20" : "5" }
                disabled={ this.isDisabled(quizResult) }
              />
            }
            else if (question.type === quizAnswerTypes.SMALLTEXT || question.type === quizAnswerTypes.NUMBER || question.type === quizAnswerTypes.URL) {
              inputHtml = <input 
                placeholder={question.placeholder}
                id={question.id}
                className="form-control"
                required={ !question.optional }
                value={ this.getQuizValue(question.id, quizResult) } 
                onChange={ (e) => { this.handleFormChange(e); } }
                type={ (question.type === quizAnswerTypes.URL) ? 'url' : (question.type === quizAnswerTypes.NUMBER) ? 'number' : 'text' }
                disabled={ this.isDisabled(quizResult) }
              />
            }
            else if (question.type === quizAnswerTypes.PICKLIST) {
              inputHtml = <input 
                placeholder={question.placeholder}
                id={question.id}
                className="form-control"
                required={ !question.optional }
                value={ this.getQuizValue(question.id, quizResult) } 
                onChange={ (e) => { this.handleFormChange(e); } }
                type={ (question.type === quizAnswerTypes.URL) ? 'url' : 'text' }
                disabled={ this.isDisabled(quizResult) }
              />
              inputHtml = <select 
                id={question.id}
                className="form-control"
                required={ !question.optional }
                value={ this.getQuizValue(question.id, quizResult) }
                onChange={ (e) => { this.handleFormChange(e); } }
                disabled={ this.isDisabled(quizResult) }
              >
                { question.values.map((value) => {
                  return <option value={value}>{value}</option>
                }) }
              </select>
            }

            return <div className="form-group question row" key={question.id}>
              <label
                htmlFor={question.id}
                className={
                  `${(this.props.inline || question.type === quizAnswerTypes.FREETEXTLONG) ? '': 'col-md-3'}
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
          }
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
      return <div className={ `quizWrapper ${(this.props.inline) ? 'inline': 'embedded'} ${ (this.hasQuizResult()) ? 'quizResults' : ''}`}>
        { (this.props.inline && !this.hasQuizResult()) ? <div className="quizHeader">Answer these questions to complete the quest.</div> : ''}
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
    embeddedPage: state.embeddedPage,
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
