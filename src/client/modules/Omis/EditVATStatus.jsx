import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout, Form, StatusMessage } from '../../components'
import { OrderResource } from '../../components/Resource'
import { TASK_EDIT_ORDER_VAT_STATUS } from './state'
import { transformVatStatusForApi } from './transformers'
import { FieldVATStatus } from './EditInvoiceDetails'
import urls from '../../../lib/urls'

const EditBillingAddress = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <DefaultLayout
          heading="Confirm VAT status"
          pageTitle={`Confirm VAT status - ${order.reference} - Orders (OMIS)`}
          breadcrumbs={[
            {
              link: urls.dashboard.index(),
              text: 'Home',
            },
            {
              link: urls.omis.index(),
              text: 'Orders (OMIS)',
            },
            {
              link: urls.omis.order(order.id),
              text: order.reference,
            },
            { text: 'Confirm VAT status' },
          ]}
        >
          <Form
            id="edit-order-vat-status"
            analyticsFormName="editOrderVatStatus"
            submitButtonLabel="Confirm VAT Status"
            flashMessage={() => 'Billing address and VAT status updated'}
            redirectTo={() => urls.omis.edit.invoiceDetails(order.id)}
            submissionTaskName={TASK_EDIT_ORDER_VAT_STATUS}
            transformPayload={(values) =>
              transformVatStatusForApi({
                orderId,
                values,
              })
            }
          >
            <StatusMessage data-test="billing-country-message">
              The billing country has been changed.
              <br />
              <br />
              Confirm the VAT status for {order.billingAddressCountry.name}.
            </StatusMessage>
            <FieldVATStatus />
          </Form>
        </DefaultLayout>
      )}
    </OrderResource>
  )
}

export default EditBillingAddress
