# DevSecOps Kubernetes Demo

This repository is a k8s Apple Store demo built for GitOps and secure deployment workflows. The stack is intended to run in Kubernetes namespaces with ArgoCD for deployment, ArgoCD Image Updater for automated image rollouts, and Cloud Build for secure container build pipelines.

## Architecture

- `app/frontend` - React + Vite storefront deployed as a Kubernetes service
- `app/backend` - FastAPI catalog, authentication, and item CRUD service
- `app/order-service` - FastAPI order processing service for completed orders
- `app/infra/k8s` - Kubernetes manifests for frontend, backend, order service, PostgreSQL, and namespaces
- `app/infra/argocd` - ArgoCD Application and Image Updater configuration
- `cloudbuild.yaml` - Cloud Build pipeline for building, scanning, and pushing Docker images

## DevSecOps Focus

This project demonstrates a Kubernetes delivery pipeline with security and GitOps at the core:

- ArgoCD GitOps deployment for automated sync and self-healing
- ArgoCD Image Updater for automated image tag updates
- Cloud Build pipeline for build, scan, and push operations
- Trivy vulnerability scanning for container images
- Namespace isolation for frontend, backend, order service, and PostgreSQL
- ConfigMap and Secret management for runtime configuration

## Features

- Database-backed Apple Store catalog and order persistence
- User registration, login, and token-based authentication
- Separate service boundaries for frontend, backend, and order processing
- Kubernetes-ready deployments with NGINX proxying
- GitOps-driven application sync and image rollout automation
- Secure build pipeline with image scanning

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: PostgreSQL
- Deployment: Kubernetes, ArgoCD, ArgoCD Image Updater, NGINX proxy, ConfigMaps, Secrets
- CI/CD: Google Cloud Build, Docker, Trivy

## Kubernetes Deployment

The Kubernetes manifests live under `app/infra/k8s`.

- `backend/` - backend deployment, service, config, and secret
- `order/` - order-service deployment, service, config, and secret
- `frontend/` - frontend deployment and service
- `postgres/` - PostgreSQL service, secret, and statefulset
- `namespaces/` - namespace definitions for backend, frontend, order, and postgres

### Example deployment order

```bash
kubectl apply -f app/infra/k8s/namespaces/kustomization.yaml
kubectl apply -f app/infra/k8s/postgres/kustomization.yaml
kubectl apply -f app/infra/k8s/backend/kustomization.yaml
kubectl apply -f app/infra/k8s/order/kustomization.yaml
kubectl apply -f app/infra/k8s/frontend/kustomization.yaml
```

## ArgoCD

This repository includes ArgoCD support for GitOps deployment.

- `app/infra/argocd/argocd.yaml` defines the ArgoCD Application named `grafana-demo`.
- The application syncs Kubernetes manifests from the repository path `app/infra/k8s` on branch `main`.
- Sync policy is automated with `prune: true` and `selfHeal: true` for drift correction.
- `app/infra/argocd/image-updater.yaml` configures ArgoCD Image Updater for the frontend, backend, and order images.
- Image Updater can automatically refresh image tags and write manifest changes back to Git.

## Cloud Build Pipeline

The `cloudbuild.yaml` file builds, scans, and pushes container images for:

- `frontend`
- `backend`
- `order`

It uses `gcr.io/cloud-builders/docker` for building and pushing, and `aquasec/trivy` for vulnerability scanning.

## Operational Notes

- Frontend requests use NGINX to proxy `/api/` to the backend and `/api/orders` to the order service.
- The order service is exposed internally on port `8000` in the cluster.
- Kubernetes runtime configuration is managed via ConfigMaps and Secrets.


## Useful Commands

- Apply Kubernetes manifests: `kubectl apply -f app/infra/k8s/kustomization.yaml`
- Trigger Cloud Build: `gcloud builds submit --config cloudbuild.yaml .`
- Check ArgoCD apps: `kubectl -n argocd get applications`

## Project Status

This repository is a Kubernetes DevSecOps demo built for GitOps deployment, secure container pipelines, and cluster-native service isolation.
