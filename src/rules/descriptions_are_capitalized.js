import { getDescription } from 'graphql/utilities/buildASTSchema';
import { ValidationError } from '../validation_error';

export function DescriptionsAreCapitalized(configuration, context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      // Rule should pass if there's an empty/missing string description. If empty
      // strings aren't wanted, the `*_have_descriptions` rules can be used.
      if (!node.description || node.description.value == '') {
        return;
      }

      const description = node.description.value;

      // It's possible there could be some markdown characters that do not
      // pass this test. If we discover some examples of this, we can improve.
      // More likely this test will actually miss some issues due to markdown
      // characters, for example if the first word is formatted.
      const firstCharacter = description[0];
      if (firstCharacter === firstCharacter.toUpperCase()) return;

      const fieldName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new ValidationError(
          'descriptions-are-capitalized',
          `The description for field \`${parentName}.${fieldName}\` should be capitalized.`,
          [node]
        )
      );
    },
  };
}
