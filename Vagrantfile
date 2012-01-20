# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|

  config.vm.box = "pressupbox"
  config.vm.box_url = "https://s3-eu-west-1.amazonaws.com/wordpress-appliance/pressupbox-with-software.box"

  config.ssh.forward_agent = true

  # Boot with a GUI so you can see the screen. (Default is headless)
  # config.vm.boot_mode = :gui

  # Assign this VM to a host-only network IP, allowing you to access it
  # via the IP. Host-only networks can talk to the host machine as well as
  # any other machines on the same network, but cannot be accessed (through this
  # network interface) by any external networks.
  config.vm.network :hostonly, "33.33.33.10"

  # Assign this VM to a bridged network, allowing you to connect directly to a
  # network using the host's network device. This makes the VM appear as another
  # physical device on your network.
  # config.vm.network :bridged

  # Forward a port from the guest to the host, which allows for outside
  # computers to access the VM, whereas host only networking does not.
  config.vm.forward_port 80, 2280

  # Share an additional folder to the guest VM. The first argument is
  # an identifier, the second is the path on the guest to mount the
  # folder, and the third is the path on the host to the actual folder.
  config.vm.share_folder("home-pressup", "/home/vagrant/pressup", ".", :nfs => true)

  # Enable provisioning with chef solo, specifying a cookbooks path (relative
  # to this Vagrantfile), and adding some recipes and/or roles.
  #
   config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "tools/pressupbox/cookbooks"
    chef.roles_path = "tools/pressupbox/roles"
    chef.add_role "pressupbox-dev"    
   end

end
