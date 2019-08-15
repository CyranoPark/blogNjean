import React from 'react';
import '../style/Theme.less';

export default function Theme (props) {
  const { onThemeBtnClick } = props;
  return (
    <div className="theme-selector">
      <div
        className="selector-white"
        onClick={() => onThemeBtnClick(0)}
      >
        <span>새하얀</span>
      </div>
      <div
        className="selector-second"
        onClick={() => onThemeBtnClick(1)}
      >
        <span>다크</span>
      </div>
      <div
        className="selector-third"
        onClick={() => onThemeBtnClick(2)}
      >
        <span>감성</span>
      </div>
    </div>
  );
}