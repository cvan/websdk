/* global describe, it, before */

import chai from 'chai';
import WebSDK from '../dist/websdk.js';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of `WebSDK`', () => {
  before(() => {
    lib = new WebSDK();
  });

  describe('when getting the product name', () => {
    it('should return the product name', () => {
      expect(lib.productName).to.be.equal('WebSDK');
    });
  });
});

describe('Given an instance of `WebSDK` with a name of "WebVR Rocks"', () => {
  before(() => {
    lib = new WebSDK({
      name: 'WebVR Rocks'
    });
  });

  describe('when getting the product name', () => {
    it('should return the product name', () => {
      expect(lib.productName).to.be.equal('WebSDK');
    });
  });

  describe('when getting the app name', () => {
    it('should return the app name', () => {
      expect(lib.name).to.be.equal('WebVR Rocks');
    });
  });

  describe('when getting the app slug', () => {
    it('should return a default app slug', () => {
      expect(lib.slug).to.be.equal('webvr_rocks');
    });
  });

  describe('when getting the app manifest', () => {
    it('should return a default empty object', () => {
      expect(lib.manifest).to.be.an.empty('object');
    });
  });
});
