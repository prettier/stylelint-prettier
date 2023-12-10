import {getTestRule} from 'jest-preset-stylelint';

global.testRule = getTestRule({plugins: ['./']});
