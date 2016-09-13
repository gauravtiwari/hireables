Rails.application.routes.draw do
  root to: 'pages#home'

  devise_for :developers, skip: [:sessions, :passwords, :confirmations, :registrations],
                     controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  as :developer do
    delete 'logout', to: 'devise/sessions#destroy', as: :destroy_developer_session
    get 'login', to: 'devise/sessions#new', as: :new_developer_session
  end

  resources :developers, only: [:index, :show] do
    collection do
      post :search
    end
  end
end
