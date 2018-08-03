import React from 'react';
import PropTypes from 'prop-types';
import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiOverlayMask,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiButton,
} from '@elastic/eui';
import { Navbar } from '../navbar';
import { WorkpadLoader } from '../workpad_loader';
import { PageManager } from '../page_manager';
import { Expression } from '../expression';
import { Tray } from './tray';

export const Toolbar = props => {
  const {
    editing,
    selectedElement,
    tray,
    setTray,
    previousPage,
    nextPage,
    selectedPageNumber,
    workpadName,
    totalPages,
  } = props;

  const elementIsSelected = Boolean(selectedElement);

  const done = () => setTray(null);

  const showHideTray = exp => {
    if (tray && tray === exp) return done();
    setTray(exp);
  };

  const workpadLoader = (
    <EuiOverlayMask>
      <EuiModal onClose={done} style={{ maxWidth: '80vw' }}>
        <EuiModalBody>
          <WorkpadLoader onClose={done} />
        </EuiModalBody>
        <EuiModalFooter>
          <EuiButton size="s" onClick={done}>
            Dismiss
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );

  const trays = {
    pageManager: <PageManager previousPage={previousPage} />,
    workpadloader: workpadLoader,
    expression: !elementIsSelected ? null : <Expression done={done} />,
  };

  return !editing ? null : (
    <div>
      {trays[tray] && <Tray done={done}>{trays[tray]}</Tray>}
      <Navbar>
        <EuiFlexGroup alignItems="center" gutterSize="none" className="canvasNavBar__controls">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              color="text"
              iconType="grid"
              onClick={() => showHideTray('workpadloader')}
            >
              {workpadName}
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false} />
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              color="text"
              onClick={previousPage}
              iconType="arrowLeft"
              disabled={selectedPageNumber <= 1}
              aria-label="Previous Page"
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty color="text" onClick={() => showHideTray('pageManager')}>
              Page {selectedPageNumber}
              {totalPages > 1 ? ` of ${totalPages}` : null}
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              color="text"
              onClick={nextPage}
              iconType="arrowRight"
              disabled={selectedPageNumber >= totalPages}
              aria-label="Next Page"
            />
          </EuiFlexItem>
          <EuiFlexItem />
          {elementIsSelected && (
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                color="text"
                iconType="editorCodeBlock"
                onClick={() => showHideTray('expression')}
              >
                Expression editor
              </EuiButtonEmpty>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </Navbar>
    </div>
  );
};

Toolbar.propTypes = {
  workpadName: PropTypes.string,
  editing: PropTypes.bool,
  tray: PropTypes.node,
  setTray: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  selectedPageNumber: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  selectedElement: PropTypes.object,
};
