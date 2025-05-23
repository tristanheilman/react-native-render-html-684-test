import React from 'react';
import {render} from '@testing-library/react-native';
import RenderHTML, {
  HTMLElementModel,
  HTMLContentModel,
} from 'react-native-render-html'; // Import from built files
import {Text} from 'react-native';

function ParagraphRenderer({TDefaultRenderer, ...props}) {
  return (
    <TDefaultRenderer {...props} style={{width: '100%'}}>
      <Text style={{flex: 1}}>{props.tnode.data}</Text>
    </TDefaultRenderer>
  );
}

export const customHTMLElementModels = {
  p: HTMLElementModel.fromCustomModel({
    tagName: 'p',
    contentModel: HTMLContentModel.textual,
  }),
};
/**
 * https://github.com/meliorence/react-native-render-html/issues/684
 */
describe('RenderHTML component', () => {
  it('should not trigger defaultProps warning', () => {
    // Mock console.warn to capture warnings
    const originalWarn = console.warn;
    const warnings: string[] = [];
    console.warn = (...args) => {
      warnings.push(args.join(' '));
    };

    // Render a component that would previously trigger the warning
    render(
      <RenderHTML
        source={{html: '<p>Test content</p>'}}
        customHTMLElementModels={customHTMLElementModels}
        contentWidth={300}
        renderers={{
          p: ParagraphRenderer,
        }}
      />,
    );

    // Restore console.warn
    console.warn = originalWarn;

    console.log('WARNINGS: ', warnings);

    // Check that no defaultProps warnings were emitted
    const defaultPropsWarnings = warnings.filter(
      warning =>
        warning.includes('defaultProps') &&
        warning.includes('function components'),
    );
    expect(defaultPropsWarnings).toHaveLength(0);
  });
});
