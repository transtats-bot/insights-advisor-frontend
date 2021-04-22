import './_Export.scss';

import React, { useMemo, useState } from 'react';
import { leadPage, tablePage } from './SystemsPdfBuild';

import API from '../../Utilities/Api';
import { BASE_URL } from '../../AppConstants';
import { DownloadButton } from '@redhat-cloud-services/frontend-components-pdf-generator';
import PropTypes from 'prop-types';
import messages from '../../Messages';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { workloadQueryBuilder } from '../Common/Tables';

const SystemsPdf = ({ filters }) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const selectedTags = useSelector(
    ({ AdvisorStore }) => AdvisorStore.selectedTags
  );
  const workloads = useSelector(({ AdvisorStore }) => AdvisorStore.workloads);
  const SID = useSelector(({ AdvisorStore }) => AdvisorStore.SID);

  const dataFetch = async () => {
    setLoading(true);
    let options = selectedTags.length && { tags: selectedTags };
    workloads &&
      (options = { ...options, ...workloadQueryBuilder(workloads, SID) });
    const systems = (
      await API.get(
        `${BASE_URL}/export/systems/`,
        {},
        { ...filters, ...options }
      )
    ).data;

    const firstPage = leadPage({
      systemsTotal: systems?.length,
      systems: systems.slice(0, 18),
      filters,
      tags: selectedTags,
      intl,
    });

    const otherPages = systems
      .slice(18, 982)
      .reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 31);
        !resultArray[chunkIndex] && (resultArray[chunkIndex] = []);
        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);

    setLoading(false);

    return [
      firstPage,
      ...otherPages.map((pageSystems, index) =>
        tablePage({ page: index, systems: pageSystems, intl })
      ),
    ];
  };

  return useMemo(() => {
    return (
      <DownloadButton
        groupName={intl.formatMessage(messages.redHatInsights)}
        allPagesHaveTitle={false}
        label={
          loading
            ? intl.formatMessage(messages.loading)
            : intl.formatMessage(messages.exportPdf)
        }
        asyncFunction={dataFetch}
        buttonProps={{
          variant: '',
          component: 'button',
          className: 'pf-c-dropdown__menu-item systemsPdfOverride',
          ...(loading ? { isDisabled: true } : null),
        }}
        reportName={`${intl.formatMessage(messages.insightsHeader)}:`}
        type={intl.formatMessage(messages.systems)}
        fileName={`Advisor_systems--${new Date()
          .toUTCString()
          .replace(/ /g, '-')}.pdf`}
        size={[841.89, 595.28]}
      />
    );
  }, [loading]);
};

SystemsPdf.propTypes = {
  filters: PropTypes.object,
  systemsCount: PropTypes.number,
};

export default SystemsPdf;
