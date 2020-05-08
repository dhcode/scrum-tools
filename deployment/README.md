# Kubernetes deployment

Note: I used [microk8s](https://microk8s.io/) to setup the kubernetes cluster with addons: dns storage ingress

Install keydb:

    helm repo add enapter https://enapter.github.io/charts/
    helm install scrum-tools-keydb enapter/keydb --set persistentVolume.storageClass=microk8s-hostpath
    
Create scrum-tools deployment:

    kubectl create -f deployment/scrum-tools.yaml
    
Check for when it is ready:

    kubectl get pods
    kubectl logs pod/scrum-tools
    
Create the service:
    
    kubectl apply -f deployment/scrum-tools-service.yaml

To have valid HTTPS Certificates based on letsencrypt, follow:

- [Install cert-manager](https://cert-manager.io/docs/installation/kubernetes/#installing-with-regular-manifests)
- [Configure an issuer](https://cert-manager.io/docs/tutorials/acme/ingress/#step-6-configure-let-s-encrypt-issuer)

Expose the service with ingress:

    kubectl apply -f deployment/scrum-tools-ingress.yaml
    
Update the deployment to the latest version:

    kubectl rollout restart deployment/scrum-tools
