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
import { Form, Input, Button } from 'antd';
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';
/* <ReactMarkdown
    source={contentVariableHere}
    renderers={ mdRenderers }
  /> */


class Quiz extends Component {
  constructor(props) {
      super(props);

      this.state = {
        questions: {}
      }
  }

  submitQuestion(values) {
    this.props.saveQuiz(values);
  }

  renderQuestions() {
    const layout = {
      labelCol: { span: (this.props.embedded) ? 16 : 8 },
      wrapperCol: { span: 16 },
    };

    const validateMessages = {
      required: 'This field is required!',
    }

    if (this.props.quizData.questions) {
      return <Form {...layout} name="nest-messages" onFinish={(values) => { this.submitQuestion(values) }} validateMessages={validateMessages}>
        { this.props.quizData.questions.map((question) => {
          if (question.type === quizAnswerTypes.FREETEXT) {
            return <Form.Item name={question.id} label={question.name} rules={[{ required: true }]}>
              <Input.TextArea placeholder={question.placeholder} />
            </Form.Item>;
          }
        }) }

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    }
    else {
      console.error('No questions defined for quiz.', this.props.quizData);
    }
  }

  render() {
    if (this.props.quizData) {
      return <div className="row quiz">
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
