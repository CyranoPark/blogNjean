import React from 'react';
import _ from 'lodash';
import '../style/Theme.less';

export default function Theme(props) {
  const { onThemeBtnClick, themes } = props;

  return (
    <div className="theme-selector">
      <div
        className="selector-white"
        onClick={_.partial(onThemeBtnClick, themes[0])}
      >
        <span>새하얀</span>
      </div>
      <div
        className="selector-second"
        onClick={_.partial(onThemeBtnClick, themes[1])}
      >
        <span>다크</span>
      </div>
      <div
        className="selector-third"
        onClick={_.partial(onThemeBtnClick, themes[2])}
      >
        <span>감성</span>
      </div>
    </div>
  );
}
