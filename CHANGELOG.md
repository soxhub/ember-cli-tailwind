# Change log

Releases (along with upgrade instructions) are documented on the Github [Releases](https://github.com/embermap/ember-cli-tailwind/releases) page.

### 0.6.3-ab-v1.3

This release updates `ember-composable-helpers` which will be needed to upgrade `soxhub-client` to any `ember-source` version higher than 3.16.

Currently, `soxhub-client` throws the following error without this update: `You attempted to overwrite the built-in helper "array" which is not allowed. Please rename the helper.`

I traced this back to `ember-composable-helpers`. I upgraded `ember-composable-helpers` in the client, but our fork of `ember-cli-tailwind` uses the old 2.x version which has the `array` helper. In order to use the new version of `ember-composable-helpers`, the addon needs to be upgraded to Ember 3.13+. And in order to do that, `ember-cli-sass` needs to be upgraded. So ya, I did the minimum required to get `soxhub-client` not to throw any errors.
