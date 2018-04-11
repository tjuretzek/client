import { withCall, withData } from 'spunky';
import { compose, withProps } from 'recompose';

import TestInvoke from './TestInvoke';
import { getCurrentNetwork } from '../../../actions/settings/currentNetworkActions';
import withClean from '../../../hocs/dapps/withClean';
import withNullLoader from '../../../hocs/dapps/withNullLoader';
import withRejectMessage from '../../../hocs/dapps/withRejectMessage';

const mapInvokeDataToProps = (script) => ({ script });
const mapSettingsDataToProps = ({ currentNetwork }) => ({ net: currentNetwork });

export default function makeStorageComponent(testInvokeActions) {
  return compose(
    // Clean redux store when done
    withClean(testInvokeActions),

    // Rename arguments given by the user
    withProps(({ args }) => ({
      scriptHash: args[0],
      operation: args[1],
      args: args.slice(2)
    })),

    // Get the current network
    withData(getCurrentNetwork, mapSettingsDataToProps),

    // Run the test invoke & wait for success or failure
    withCall(testInvokeActions, ({ net, scriptHash, operation, args }) => ({
      net,
      scriptHash,
      operation,
      args
    })),
    withNullLoader(testInvokeActions),
    withRejectMessage(testInvokeActions, (props) => (
      `Invocation failed for operation "${props.operation}" on "${props.scriptHash}"`
    )),
    withData(testInvokeActions, mapInvokeDataToProps)
  )(TestInvoke);
}
