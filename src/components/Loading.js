import React from 'react';

import loadGif from '../images/preloader.gif';

export default function Loading() {
  return (
    <img src={loadGif} className="loading-img"/>
  );
}