import { useContext, useState, useEffect } from 'react';
import { ScrapeContext } from './ScrapeContext';

export default function Subscribe(props) {
  const { setEmailAlert } = useContext(ScrapeContext);
  const [state, setState] = useState({
    showModal: props.showModal,
    setModalState: props.setModalState,
    query: props.query,
  });

  const [email, setEmail] = useState('');
  const [subscribed, setSubcribed] = useState(false);

  useEffect(() => {
    setState(props);
  });

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const setAlert = () => {
    setSubcribed(true);
    setEmailAlert({ query: state.query, email });
  };

  const close = () => {
    setSubcribed(false);
    setEmail('');
    state.updateModalState({ showModal: false });
  };

  return (
    <div class={state.showModal === true ? 'is-active modal' : 'modal'}>
      <div class="modal-background" onClick={close}></div>
      <div class="modal-card has-padding-7">
        <section class="modal-card-body is-rounded-4">
          <div class="container">
            <div class="title is-4 has-text-centered">
              <h3>Don't miss out!</h3>
            </div>
            <div class="has-margin-6 has-text-centered">
              {subscribed === false ? (
                <span>
                  Receive an alert when there's a new job matching '
                  {state.query}'
                </span>
              ) : (
                <p>Awesome! We have send a verification mail</p>
              )}
            </div>
            <div class="columns has-margin-7">
              <div class="column is-9">
                <div class="control has-icons-right">
                  <input
                    class="input"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleChange}
                  />
                  <span class="icon is-medium is-right">
                    <i class="fa fa-envelope-o"></i>
                  </span>
                </div>
              </div>
              <div class="column is-3">
                <button
                  class="button is-primary is-fullwidth"
                  onClick={setAlert}
                >
                  Set Alert
                </button>
              </div>
            </div>
            <div class="has-text-centered">
              <span class="subtitle is-7">Join other 124 subscribers</span>
            </div>
          </div>
        </section>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        onClick={close}
      ></button>
    </div>
  );
}
