import './_Common.scss';

import {
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core/dist/js/components/Text/index';
import { createIntl, createIntlCache } from 'react-intl';

import PowerOffIcon from '@patternfly/react-icons/dist/esm/icons/power-off-icon';
import React from 'react';
import messages from '../../Messages';
import { strong } from '../../Utilities/intlHelper';

const cache = createIntlCache();
const locale = navigator.language.slice(0, 2);
const intl = createIntl(
  {
    // eslint-disable-next-line no-console
    onError: console.log,
    locale,
  },
  cache
);

const RebootRequired = (reboot_required) => (
  <span className="system-reboot-message">
    <PowerOffIcon
      className={
        reboot_required ? 'reboot-required-icon' : 'no-reboot-required-icon'
      }
    />
    <TextContent className="system-reboot-message__content">
      <Text component={TextVariants.p}>
        {intl.formatMessage(messages.systemReboot, {
          strong: (str) => strong(str),
          status: reboot_required
            ? intl.formatMessage(messages.is)
            : intl.formatMessage(messages.isNot),
        })}
      </Text>
    </TextContent>
  </span>
);

export { RebootRequired };
