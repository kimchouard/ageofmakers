/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import CustomMessage from './game/components/customMessage';
import BandlabPlayer from './game/components/bandlabPlayer';
import Countdown from './game/components/countdown';

export const mdRenderers = {
  code: ({ language, value }) => {
    if (language === 'warning' || language === 'info') {
      return <CustomMessage type={language}>
        { value }
      </CustomMessage>
    }

    if (language === 'bandlab') {
      return <BandlabPlayer musicId={value} />
    }

    if (language === 'countdown') {
      return <Countdown minutes={value} />
    }

    // Or default code snippet
    const className = language && `language-${language}`
    const code = React.createElement('code', className ? { className: className } : null, value)
    return React.createElement('pre', {}, code)
  },
  image: ({ src, alt }) => {
    return (
      <img
        alt={alt}
        src={ (src.search('http') === -1) ? chrome.extension.getURL(src) : src }
      />
    );
  }
}