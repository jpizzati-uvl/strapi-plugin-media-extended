import * as React from 'react';
import {
  Pagination as PaginationImpl,
  PreviousLink,
  NextLink,
  PageLink,
  Dots,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';

interface PaginationData {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface PaginationFooterProps {
  activePage: number;
  onChangePage: (page: number) => void;
  pagination: PaginationData;
}

export const PaginationFooter = ({
  activePage,
  onChangePage,
  pagination,
}: PaginationFooterProps) => {
  const { formatMessage } = useIntl();
  const { pageCount } = pagination;

  const boundaryCount = 1;
  const siblingCount = 1;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, pageCount));
  const endPages = range(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount);

  const siblingsStart = Math.max(
    Math.min(
      activePage - siblingCount,
      pageCount - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(
      activePage + siblingCount,
      boundaryCount + siblingCount * 2 + 2
    ),
    endPages.length > 0 ? endPages[0] - 2 : pageCount - 1
  );

  const items = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis']
      : boundaryCount + 1 < pageCount - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < pageCount - boundaryCount - 1
      ? ['end-ellipsis']
      : pageCount - boundaryCount > boundaryCount
        ? [pageCount - boundaryCount]
        : []),
    ...endPages,
  ];

  if (pageCount <= 1) {
    return null;
  }

  return (
    <PaginationImpl activePage={activePage} pageCount={pageCount}>
      <PreviousLink onClick={() => onChangePage(activePage - 1)}>
        {formatMessage({
          id: 'components.pagination.go-to-previous',
          defaultMessage: 'Go to previous page',
        })}
      </PreviousLink>
      {items.map((item) => {
        if (typeof item === 'number') {
          return (
            <PageLink
              key={item}
              number={item}
              onClick={() => onChangePage(item)}
            >
              {formatMessage(
                { id: 'components.pagination.go-to', defaultMessage: 'Go to page {page}' },
                { page: item }
              )}
            </PageLink>
          );
        }

        return <Dots key={item} />;
      })}

      <NextLink onClick={() => onChangePage(activePage + 1)}>
        {formatMessage({
          id: 'components.pagination.go-to-next',
          defaultMessage: 'Go to next page',
        })}
      </NextLink>
    </PaginationImpl>
  );
};