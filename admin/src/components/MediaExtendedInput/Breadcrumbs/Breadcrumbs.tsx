import {
  Breadcrumbs as BaseBreadcrumbs,
  Crumb,
  CrumbLink,
  BreadcrumbsProps as BaseBreadcrumbsProps,
} from '@strapi/design-system';
import { useIntl, MessageDescriptor } from 'react-intl';

export type CrumbDefinition = {
  id?: number | null;
  label?: MessageDescriptor | string;
  href?: string;
  path?: string;
};

export interface BreadcrumbsProps extends BaseBreadcrumbsProps {
  breadcrumbs: Array<CrumbDefinition>;
  currentFolderId?: number | null;
  onChangeFolder?: (id: number | null, path?: string) => void;
}

export const Breadcrumbs = ({
  breadcrumbs,
  onChangeFolder,
  currentFolderId,
  ...props
}: BreadcrumbsProps) => {
  const { formatMessage } = useIntl();

  return (
    <BaseBreadcrumbs {...props}>
      {breadcrumbs.map((crumb, index) => {
        const isCurrentFolderMediaLibrary = crumb.id === null && currentFolderId === null;

        if (currentFolderId !== crumb.id && !isCurrentFolderMediaLibrary) {
          if (onChangeFolder) {
            return (
              <CrumbLink
                key={`breadcrumb-${crumb?.id ?? 'root'}`}
                type="button"
                onClick={() => onChangeFolder(crumb.id ?? null, crumb.path)}
              >
                {typeof crumb.label !== 'string' && crumb.label?.id
                  ? formatMessage(crumb.label)
                  : (crumb.label as string)}
              </CrumbLink>
            );
          }
        }

        return (
          <Crumb
            key={`breadcrumb-${crumb?.id ?? 'root'}`}
            isCurrent={index + 1 === breadcrumbs.length}
          >
            {typeof crumb.label !== 'string' && crumb.label?.id
              ? formatMessage(crumb.label)
              : (crumb.label as string)}
          </Crumb>
        );
      })}
    </BaseBreadcrumbs>
  );
};